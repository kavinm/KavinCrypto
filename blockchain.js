
const Block = require('./block');
const cryptoHash = require('./crypto-hash'); 

class Blockchain{
    constructor(){
        this.chain = [Block.genesis()];
    }

    addBlock({data}){
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length-1],
            data
        });

        this.chain.push(newBlock);
    }

    
    static isValidChain(chain){
        //objects in js are not equal unless they are the same object
        //json.stringify will check if it contains all the same data as genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify( Block.genesis())) {
            return false;
        }

        for(let i=1; i<chain.length; i++){
            const block = chain[i]; //local block copied from chain

            const actualLastHash = chain[i-1].hash; //get real last Hash

            const {timestamp, lastHash, hash, data } = block; // store local copies

            if (lastHash !== actualLastHash) return false;  //check if lastHash matches up

            const validatedHash = cryptoHash(timestamp, lastHash, data); //validate hash

            if(hash !== validatedHash){
                return false;
            }
        }

        return true;
    }

    replaceChain(chain){ 
        //if chain is not longer exit
        if(chain.length <= this.chain.length){
            console.error('the incoming chain must be longer');
            return;
        }
        //validate chain
        if (!Blockchain.isValidChain(chain)){
            console.error('the incoming chain must be valid');
            return;
        }
        console.log('replacing chain with ', chain);
        this.chain = chain;
    }
}

module.exports = Blockchain;