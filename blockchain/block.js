const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("../config");
const {cryptoHash} = require("../util/");

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
        let { difficulty } = lastBlock; // destructuring syntax same as  difficulty = lastBlock.difficulty
        let nonce = 0; //adjustable/dynamic value

        do {
            nonce++;
            timestamp = Date.now();
            // difficulty is adjusted based on lastBlock and current timestamp
            difficulty = Block.adjustDifficulty({
                originalBlock: lastBlock,
                timestamp,
            });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (
            hexToBinary(hash).substring(0, difficulty) !==
            "0".repeat(difficulty)
        ); // checks for leading zeroes
        // we do a difficulty check on the binary version of the hash
        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }

    //change difficulty based on difference of timeStamp of currentBlock vs lastBlock
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock; // destructred , same as const difficulty = originalBlock.difficulty

        const difference = timestamp - originalBlock.timestamp;

        //lower limit of 1, otherwise errors will occur
        if (difficulty < 1) {
            return 1;
        }

        if (difference > MINE_RATE) {
            return difficulty - 1;
        }

        return difficulty + 1;
    }
}

module.exports = Block; //nodejs sharing code syntax between files
