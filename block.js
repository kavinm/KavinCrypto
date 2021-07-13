const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

//Block construcor
class Block {
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    //creates genesis Block
    static genesis() {
        /*return new Block({
            timestamp: 1,
            lastHash: 'none',
            hash: 'hash-one',
            data: []
        })*/

        return new this(GENESIS_DATA);
    }

    //mineBlock function, needs lastBlock as input but is static
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        //const timestamp = Date.now();
        const lastHash = lastBlock.hash;
        const { difficulty } = lastBlock; // destructuring syntax same as const difficulty = lastBlock.difficulty
        let nonce = 0; //adjustable/dynamic value

        do {
            nonce++;
            timestamp = Date.now();
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (hash.substring(0, difficulty) !== "0".repeat(difficulty)); // checks for leading zeroes

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }
}

module.exports = Block; //nodejs sharing code syntax between files
