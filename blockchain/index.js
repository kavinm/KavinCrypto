const Block = require("./block");
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet');
const {cryptoHash} = require("../util/");
const { REWARD_INPUT, MINING_REWARD } = require("../config");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });

        this.chain.push(newBlock);
    }

    validTransactionData({chain }){

        for(let i = 1; i<chain.length; i++){
            const block = chain[i];

            //Set allows us to create a unique group of elements
            const transactionSet = new Set();

            let rewardTransactionCount = 0;

            
            for(let transaction of block.data){
                //check that reward transaction is valid
                if (transaction.input.address === REWARD_INPUT.address){
                    rewardTransactionCount+= 1;

                    if(rewardTransactionCount>1){
                        console.error('Miner rewards exceeds limit')
                        return false;
                    }

                    if(Object.values(transaction.outputMap)[0] !== MINING_REWARD){
                        console.error('Miner reward is invalid');
                        return false;
                    }
                }

                //check that normal transactions are valid
                else{
                    if(!Transaction.validTransaction(transaction)){
                        console.error('Invalid transaction');
                        return false;
                    }
                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address
                    });

                    if(transaction.input.amount !== trueBalance){
                        console.error('Invalid Input amount');
                        return false;
                    }

                    if(transactionSet.has((transaction))){
                        console.error('An identical transaction appears more than once in the block');
                        return false;
                    }
                    else{
                        transactionSet.add(transaction);
                    }

                }

            }
        }
        return true;
    }

    static isValidChain(chain) {
        //objects in js are not equal unless they are the same object
        //json.stringify will check if it contains all the same data as genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        for (let i = 1; i < chain.length; i++) {
            const { timestamp, lastHash, hash, nonce, difficulty, data } =
                chain[i]; //local block copied from chain

            const actualLastHash = chain[i - 1].hash; //get real last Hash

            const lastDifficulty = chain[i - 1].difficulty;

            if (lastHash !== actualLastHash) return false; //check if lastHash matches up

            const validatedHash = cryptoHash(
                timestamp,
                lastHash,
                data,
                nonce,
                difficulty
            ); //validate hash

            if (hash !== validatedHash) {
                return false;
            }

            //takes care of difficulty being raised too high or too low
            if (Math.abs(lastDifficulty - difficulty) > 1) {
                return false;
            }
        }

        return true;
    }

    replaceChain(chain, validateTransactions, onSuccess) {
        //if chain is not longer exit
        if (chain.length <= this.chain.length) {
            console.error("the incoming chain must be longer");
            return;
        }
        //validate chain
        if (!Blockchain.isValidChain(chain)) {
            console.error("the incoming chain must be valid");
            return;
        }

        if(validateTransactions && !this.validTransactionData({chain})){
            console.error('The incoming chain has invalid data');
            return;
        }

        if(onSuccess) onSuccess();
        console.log("replacing chain with ", chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;
