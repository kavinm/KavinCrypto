
const {GENESIS_DATA} = require('./config');

class Block{
    constructor({timestamp, lastHash, hash, data}){

      this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    
    static genesis(){
        /*return new Block({
            timestamp: 1,
            lastHash: 'none',
            hash: 'hash-one',
            data: []
        })*/

        return new this(GENESIS_DATA);
    }

    static mineBlock({lastBlock, data}){
        return new this({
            timestamp: Date.now(),      
            lastHash: lastBlock.hash,
            data
        });
    }
}


module.exports = Block; //nodejs sharing code syntax between files









