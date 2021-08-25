//middleware
const bodyParser = require("body-parser");

const express = require("express");

const request = require('request');

const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require("./wallet");
const TransactionMiner = require('./app/transaction-miner');



const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({blockchain, transactionPool});
const transactionMiner = new TransactionMiner({blockchain, transactionPool, wallet, pubsub});

const DEFAULT_PORT = 3000;
// the first peer that is run
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//setTimeout(() => pubsub.broadcastChain(), 1000);
app.use(bodyParser.json());

//GET type HTTP request
//returns the blockchain and blocks
app.get("/api/blocks", (req, res) => {
    //request and response
    res.json(blockchain.chain);
});

//POST type HTTP request
//lets you add blocks
app.post("/api/mine", (req, res) => {
    const { data } = req.body; //same as const data = req.body.data

    blockchain.addBlock({ data });

    //broadcasts new chain with added blocks
    pubsub.broadcastChain();

    res.redirect("/api/blocks");
});

app.post("/api/transact", (req, res) =>{
    const {amount, recipient} = req.body;
    let transaction = transactionPool.existingTransaction({inputAddress: wallet.publicKey});

    try{
        if(transaction){
            transaction.update({senderWallet: wallet, recipient, amount});
        }
        else{
            transaction = wallet.createTransaction({
                recipient, amount
            });
        }
        
    } catch (error){
       return res.status(400).json({type: 'error', message: error.message})
    }

     

    transactionPool.setTransaction(transaction);

    pubsub.broadcastTransaction(transaction);

    //json object of transaction
    res.json({transaction});
});

app.get('/api/transaction-pool-map', (req, res) =>{
    res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req,res) =>{
    transactionMiner.mineTransactions();

    res.redirect('/api/blocks');
});

//makes a GET HTTP request 
const syncWithRootState = () =>{
    //when the request completes, callback is fired
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) =>{
        if(!error && response.statusCode === 200){
            //if request is successful, replace chain
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);           
        }
    });

    request({url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map`}, (error, response, body) =>{
        if(!error && response.statusCode === 200 ){
            const rootTransactionPoolMap = JSON.parse(body);

            console.log('replace transaction pool map on a sync with ', rootTransactionPoolMap);
            transactionPool.setMap(rootTransactionPoolMap);
        }
    });
};
let PEER_PORT;

//generates a random port from 3001-4000
if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT +  Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () =>{
    console.log(`listening at localhost:${PORT}`);
    if(PORT !== DEFAULT_PORT){
        syncWithRootState();
    }

} );
