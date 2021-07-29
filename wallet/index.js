const {STARTING_BALANCE} = require('../config');
const {ec} = require('../util');

class Wallet {

    constructor(){
        this.balance = STARTING_BALANCE;

        //elliptic curve public/private key pair
        const keyPair = ec.genKeyPair();

        //encoded in hex because this will return a Point object 
        this.publicKey = keyPair.getPublic().encode('hex');
    }

};

module.exports = Wallet;