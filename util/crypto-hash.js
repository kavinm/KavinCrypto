const crypto = require("crypto"); //native crypto module for creating hash function in node js

const cryptoHash = (...inputs) => {
    // will gather n arguments into inputs array
    const hash = crypto.createHash("sha256");

    hash.update(inputs.sort().join(" ")); //join concatenates all the elements of the array into one string with specified ' ' (space) between them
    //update updates hash with given data, pretty self explanatory, utf8 is standard encoding
    //we sort array so inputs in any order will produce same hash
    return hash.digest("hex"); //returns the hash in hex since specified, otherwise utf-8
};

module.exports = cryptoHash;
