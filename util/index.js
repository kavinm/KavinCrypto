//elliptic curve
const EC = require("elliptic").ec;
const cryptoHash = require('./crypto-hash');

//standards of efficient cryptography prime 256  Koblitz
const ec = new EC('secp256k1');

const verifySignature = ({publicKey, data, signature}) =>{
    //public key is encoded in hex, must specify
    const keyFromPublic = ec.keyFromPublic(publicKey, 'hex');

    return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = {ec, verifySignature, cryptoHash};