const Blockchain = require('./blockchain');

const Block = require('./block');

describe('Blockchain', () => {
    const blockchain = new Blockchain();

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
            });
        });


        describe('when the chain starts with the genesis block and has multiple blocks', () =>{
            describe('and a lastHash reference has changed', () =>{
                it('returns false', () => {});
            });

            describe('and the chain contains a block with and invalid field', () =>{
                it('returns false', () => {});
            });

            describe('and the chain does not contain any invalid blocks', () =>{
                it('returns true', () =>{

                });
            });
        });
    });

});