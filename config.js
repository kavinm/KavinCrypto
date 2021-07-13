//config.js file stores all hard coded and globabl variables/data
const MINE_RATE = 1000; //ms so 1 second

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "none",
    hash: "hash-one",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};

module.exports = { GENESIS_DATA, MINE_RATE }; // this exports the Genesis block
