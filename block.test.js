const Block = require('./block'); // requires Block class to exist in block.js
const { GENESIS_DATA } = require('./config'); // requires genesis data to exist
const cryptoHash = require('./crypto-hash');


//describe creates the test case for the Block class
describe('Block', () =>  { 
    const timestamp = 'a-date';
    const lastHash = 'foo-hash';
    const hash = 'bar-hash';
    const data = ['blockchain','data'];
    const block = new Block({
       timestamp, lastHash, hash, data
    });

// it has same paramters as describe, used for testing to actually verify
    it('has a timestamp, lastHash, hash, data property', () => { //
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.timestamp).toEqual(timestamp);
        expect(block.timestamp).toEqual(timestamp);
    });

    //test case for genesis block
    //genesis function is a static function
describe('genesis()', () =>{
    const genesisBlock = Block.genesis();

console.log('genesisBlock', genesisBlock );

    //checks if the genesisBlock is a block instance
    it('returns a Block instance', () =>{
        expect(genesisBlock instanceof Block).toBe(true); //toBe is used only for true/false (boolean values)
    });

    //checks to see if the genesisBlock also contains the specific genesis data that is hard coded
    it('returns the genesis data', () =>{
        expect(genesisBlock).toEqual(GENESIS_DATA);
    })

//test for checking mineBlock
describe('mineBlock()', () =>{
    const lastBlock = Block.genesis();          // we are describing the mineBlock object
    const data = 'mined data';          //can be any data
    const minedBlock = Block.mineBlock({lastBlock, data}); // 

    it('returns a Block instance', () =>{
        expect(minedBlock instanceof Block).toBe(true);
    });

    it('sets the `lasthash` to be the `hash` of the lastBlock ', () =>{
        expect(minedBlock.lastHash).toEqual(lastBlock.hash); // we need to have the actual value in the expect statement and the expected value second for jest
    });                                                     // functionally either order will work but this is how it's done for tdd in jest

    it('sets the `data`', () =>{
        expect(minedBlock.data).toEqual(data);
    } );

    // check to see if timestamp is not undefined, can be a different value
    it('sets a `timestamp`', () =>{
        expect(minedBlock.timestamp).not.toEqual(undefined); 
    } );

    //hash of minedBlock must equal sha256 of its timestamp, previousBlock's hash and the data 
    it('creates a SHA-256 `hash` based on the proper inputs', () =>{    
        expect(minedBlock.hash)
            .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data));    
    })
});

});



})

