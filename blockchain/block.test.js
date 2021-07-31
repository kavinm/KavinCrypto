const hexToBinary = require("hex-to-binary");
const Block = require("./block"); // requires Block class to exist in block.js
const { GENESIS_DATA, MINE_RATE } = require("../config"); // requires genesis data to exist
const {cryptoHash} = require("../util/");

//describe creates the test case for the Block class
describe("Block", () => {
    const timestamp = 2000;
    const lastHash = "foo-hash";
    const hash = "bar-hash";
    const data = ["blockchain", "data"];
    const nonce = 1;
    const difficulty = 1;

    const block = new Block({
        timestamp,
        lastHash,
        hash,
        data,
        nonce,
        difficulty,
    });

    // it has same paramters as describe, used for testing to actually verify
    it("has a timestamp, lastHash, hash, data property", () => {
        //
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
        expect(block.nonce).toEqual(nonce);
        expect(block.difficulty).toEqual(difficulty);
    });

    //test case for genesis block
    //genesis function is a static function
    describe("genesis()", () => {
        const genesisBlock = Block.genesis();

        console.log("genesisBlock", genesisBlock);

        //checks if the genesisBlock is a block instance
        it("returns a Block instance", () => {
            expect(genesisBlock instanceof Block).toBe(true); //toBe is used only for true/false (boolean values)
        });

        //checks to see if the genesisBlock also contains the specific genesis data that is hard coded
        it("returns the genesis data", () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });
    });
    //test for checking mineBlock
    describe("mineBlock()", () => {
        const lastBlock = Block.genesis(); // we are describing the mineBlock object
        const data = "mined data"; //can be any data
        const minedBlock = Block.mineBlock({ lastBlock, data }); //

        it("returns a Block instance", () => {
            expect(minedBlock instanceof Block).toBe(true);
        });

        it("sets the `lasthash` to be the `hash` of the lastBlock ", () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash); // we need to have the actual value in the expect statement and the expected value second for jest
        }); // functionally either order will work but this is how it's done for tdd in jest

        it("sets the `data`", () => {
            expect(minedBlock.data).toEqual(data);
        });

        // check to see if timestamp is not undefined, can be a different value
        it("sets a `timestamp`", () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        //hash of minedBlock must equal sha256 of its timestamp, previousBlock's hash and the data
        it("creates a SHA-256 `hash` based on the proper inputs", () => {
            expect(minedBlock.hash).toEqual(
                cryptoHash(
                    minedBlock.timestamp,
                    minedBlock.nonce,
                    minedBlock.difficulty,
                    lastBlock.hash,
                    data
                )
            );
        });

        it("sets a 'hash' that matches the difficulty critera", () => {
            expect(
                hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
            ).toEqual("0".repeat(minedBlock.difficulty));
        });

        //the difficulty will always be adjusted when block is mined,
        it("adjusts the difficulty", () => {
            const possibleResults = [
                lastBlock.difficulty + 1,
                lastBlock.difficulty - 1,
            ];

            expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
        });
    });

    describe("adjustDifficulty()", () => {
        //adjustDifficulty will take in an original block and and the timestamp of the new block
        it("raises the difficulty for a quickly mined block", () => {
            expect(
                Block.adjustDifficulty({
                    originalBlock: block,
                    timestamp: block.timestamp + MINE_RATE - 100,
                })
            ).toEqual(block.difficulty + 1);
        });
        it("lowers the difficulty for a quickly mined block", () => {
            expect(
                Block.adjustDifficulty({
                    originalBlock: block,
                    timestamp: block.timestamp + MINE_RATE + 100,
                })
            ).toEqual(block.difficulty - 1);
        });

        it("has a lower limit of 1", () => {
            block.difficulty = -1;

            expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
        });
    });
});
