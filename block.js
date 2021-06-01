
const {GENESIS_DATA} = require('./config');
const cryptoHash = require('./crypto-hash');

//Block construcor
class Block{
    constructor({timestamp, lastHash, hash, data}){

      this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }
    
    //creates genesis Block
    static genesis(){
        /*return new Block({
            timestamp: 1,
            lastHash: 'none',
            hash: 'hash-one',
            data: []
        })*/

        return new this(GENESIS_DATA);
    }

    //mineBlock function, needs lastBlock as input but is static
    static mineBlock({lastBlock, data}){
        const timestamp = Date.now();
        const lastHash = lastBlock.hash //
        
        return new this({
            timestamp,    
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data)
        });
    }
}


module.exports = Block; //nodejs sharing code syntax between files









