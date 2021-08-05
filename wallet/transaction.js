//creates an id based on timestamp, will be unique
const uuid = require("uuid/v1");
const {verifySignature} = require("../util");

class Transaction{
    constructor({senderWallet, recipient, amount}){
        this.id = uuid();
        this.outputMap = this.createOutputMap({senderWallet, recipient, amount});
        this.input = this.createInput({senderWallet, outputMap: this.outputMap});

    }

    //each transaction has a mapping to check amount sent and balance of sender
    createOutputMap({senderWallet, recipient, amount}){
        const outputMap = {};

        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

        return outputMap;
    }

    //returns an input about the transaction information
    createInput({senderWallet, outputMap}){
        return{
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap)
        };
    }

    static validTransaction(transaction){
       
        const {input:  {address, amount, signature} , outputMap} = transaction;
        //below is done in one line above as we can nest destructuring
       //const {address, amount, signature} = input;

       const outputTotal = Object.values(outputMap).reduce((total, outputAmount) =>
            total + outputAmount);
        console.log(`This is the amount: ${amount}`);
        console.log(`This is the outputTotal: ${outputTotal}`);
        //check if amount from transaction matches up
        if (amount!==outputTotal){
            console.error(`Invalid transaction from ${address}`);
            return false;
        }
        

        if(!verifySignature({publicKey: address, data: outputMap, signature})){
            console.log("\n NOT VALID \n");
            console.error(`Invalid signature from ${address}`);

            return false;
        }

        return true;
    }
}

module.exports = Transaction;