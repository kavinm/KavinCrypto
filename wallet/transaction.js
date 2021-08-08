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

    update({senderWallet, recipient, amount}){

        if(amount > this.outputMap[senderWallet.publicKey]){
            throw new Error ('Amount exceeds balance');
        }

        //checks if we are sending to the same recipient
        if(!this.outputMap[recipient]){
            
            this.outputMap[recipient] = amount;
        }
        else{
            console.log("this is the current output map amount: " + this.outputMap[recipient]);
            console.log("this is the amount: " + amount);
            this.outputMap[recipient] = this.outputMap[recipient] + amount;
        }


        this.outputMap[senderWallet.publicKey] = this.outputMap[senderWallet.publicKey] - amount;

        this.input = this.createInput({senderWallet, outputMap: this.outputMap});
    }

    static validTransaction(transaction){
       
        const {input:  {address, amount, signature} , outputMap} = transaction;
        //below is done in one line above as we can nest destructuring
       //const {address, amount, signature} = input;

       const outputTotal = Object.values(outputMap).reduce((total, outputAmount) =>
            total + outputAmount);
        //check if amount from transaction matches up
        if (amount!==outputTotal){
            console.error(`Invalid transaction from ${address}`);
            return false;
        }
        

        if(!verifySignature({publicKey: address, data: outputMap, signature})){

            console.error(`Invalid signature from ${address}`);

            return false;
        }

        return true;
    }
}

module.exports = Transaction;