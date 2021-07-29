//elliptic curve
const EC = require("elliptic").ec;

//standards of efficient cryptography prime 256  Koblitz
const ec = new EC('secp256k1');

module.exports = {ec};