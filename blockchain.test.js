const Blockchain = require('./blockchain');

const Block = require('./block');

describe('Blockchain', () => {
    let blockchain, newChain, originalChain;

    beforeEach(()=>{
        blockchain = new Blockchain(); //makes a new instance of blockchain object before each describe
        newChain = new Blockchain(); // will be used for chain replacement

        originalChain = blockchain.chain;
        
    });

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

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false); // calling it on class as it is a static method, not on the instance
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
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false); // this should result in a broken lastHash reference
                                
                });
            });

            describe('and the chain contains a block with and invalid field', () =>{
                it('returns false', () => {
                    blockchain.chain[2].data = 'changed data'; // changing a field like this should invalidate the block
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
                });
            });

            describe('and the chain does not contain any invalid blocks', () =>{
                it('returns true', () =>{
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
                });
            });
        });
    });

    describe('replaceChain()', () =>{
        describe('when the new chain is not longer', () =>{
            it('does not replace the chain', () => {
                //the new chain is the same length but different
                newChain.chain[0] = {new: 'chain'};

                blockchain.replaceChain(newChain.chain);

                expect (blockchain.chain).toEqual(originalChain);
            });
                
        });
    

        describe('when the new chain is longer', () =>{
            beforeEach(() =>{
                newChain.addBlock({data: "Lions"});
                newChain.addBlock({data: "Tigers"}); // adding blocks  to the chain to test
                newChain.addBlock({data: "Zebras"});
            });
            describe('and the chain is invalid', () =>{
                it('does not replace the chain', () =>{
                    newChain.chain[2].hash = '420xXfake-HashXx420';

                    blockchain.replaceChain(newChain.chain);

                    expect(blockchain.chain).toEqual(originalChain);
                });
            });
        
           describe('and the chain is valid', () =>{
            it('replaces the chain', () =>{
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(newChain.chain);

            });
           });
        });

    });
        






});