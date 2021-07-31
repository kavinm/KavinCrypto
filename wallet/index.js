const {STARTING_BALANCE} = require('../config');
const {ec, cryptoHash} = require('../util');


class Wallet {

    constructor(){
        this.balance = STARTING_BALANCE;

        //elliptic curve public/private key pair
         this.keyPair = ec.genKeyPair();

        //encoded in hex because this will return a Point object 
        this.publicKey = this.keyPair.getPublic().encode('hex');

    }

    sign(data){
        return this.keyPair.sign(cryptoHash(data));

    }

};

module.exports = Wallet;