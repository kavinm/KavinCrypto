//config.js file stores all hard coded and globabl variables/data

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "none",
    hash: "hash-one",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};

module.exports = { GENESIS_DATA }; // this exports the Genesis block
