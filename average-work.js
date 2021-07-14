const Blockchain = require("./blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({ data: "initial" });

let prevTimestamp, nextTimestamp, nextBlock, timeDiff, average;

//keep track of all times
const times = [];

for (let i = 0; i < 1000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

    blockchain.addBlock({ data: `block ${i}` });

    //this is the added blocl
    nextBlock = blockchain.chain[blockchain.chain.length - 1];

    nextTimestamp = nextBlock.timestamp;
    timeDiff = nextTimestamp - prevTimestamp;

    times.push(timeDiff);

    // gives us a single value from the times array specified by callback
    average = times.reduce((total, num) => total + num) / times.length;

    console.log(
        `Time to mine block: ${timeDiff}ms, Difficulty:  ${nextBlock.difficulty}, Average time ${average}ms `
    );
}
