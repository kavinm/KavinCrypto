
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

            const actualLastHash = chain[i-1].hash;

            const {timestamp, lastHash, hash, data } = block;

            if (lastHash !== actualLastHash) return false; 

            const validatedHash = cryptoHash(timestamp, lastHash, data);

            if(hash !== validatedHash){
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;