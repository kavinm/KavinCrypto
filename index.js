const bodyParser = require("body-parser");

const express = require("express");

const request = require('request');

const Blockchain = require("./blockchain");
const PubSub = require("./app/pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

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

//makes a GET HTTP request 
const syncChains = () =>{
    //when the request completes, callback is fired
    request({url: `${ROOT_NODE_ADDRESS}/api/blocks`}, (error, response, body) =>{
        if(!error && response.statusCode === 200){
            //if request is successful, replace chain
            const rootChain = JSON.parse(body);
            console.log('replace chain on a sync with', rootChain);
            blockchain.replaceChain(rootChain);           
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
        syncChains();
    }

} );
