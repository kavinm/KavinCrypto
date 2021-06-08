const Blockchain = require('./blockchain');

const Block = require('./block');

describe('Blockchain', () => {
    let blockchain;

    beforeEach(()=>{
        blockchain = new Blockchain(); //makes a new instance of blockchain object before each describe
        
    })

    it('contains a `chain` Array instance', () =>{
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it('starts with the genesis block', () =>{
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it('adds a new block to the chain', () =>{
        const newData = 'foo bar';
        blockchain.addBlock({data: newData});// we are adding an object with fields that are contained a Block object
        
        expect(blockchain.chain[blockchain.chain.length-1].data).toEqual(newData);
    });

    describe('isValidChain()', () =>{
        describe('when the chain does not start with the genesis block', () => {
            it('returns false', () =>{
                blockchain.chain[0] = {data: 'fake-genesis'};

                expect(Blockchain.IsValidChain(blockchain.chain)).toBe(false); // calling it on class as it is a static method, not on the instance
            });
        });


        describe('when the chain starts with the genesis block and has multiple blocks', () =>{
            beforeEach(() =>{
                blockchain.addBlock({data: "Lions"});
                blockchain.addBlock({data: "Tigers"}); // adding blocks  to the chain to test
                blockchain.addBlock({data: "Zebras"});  //using before each so does not have to be done in each describe
            });
            describe('and a lastHash reference has changed', () =>{
                it('returns false', () => {                  
                    blockchain.chain[2].lastHash = 'broken-lastHash'; 
                    expect(Blockchain.IsValidChain(blockchain.chain)).toBe(false); // this should result in a broken lastHash reference
                                
                });
            });

            describe('and the chain contains a block with and invalid field', () =>{
                it('returns false', () => {
                    blockchain.chain[2].data = 'changed data'; // changing a field like this should invalidate the block
                    expect(Blockchain.IsValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () =>{
                it('returns true', () =>{
                    expect(Blockchain.IsValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

});