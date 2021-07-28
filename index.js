const bodyParser = require("body-parser");

const express = require("express");

const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({blockchain});

setTimeout(() => pubsub.broadcastChain(), 1000);
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

const DEFAULT_PORT = 3000;

let PEER_PORT;

//generates a random port from 3001-4000
if(process.env.GENERATE_PEER_PORT === 'true'){
    PEER_PORT = DEFAULT_PORT +  Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => console.log(`listening at localhost:${PORT}`));
