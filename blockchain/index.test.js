const Blockchain = require(".");

const Block = require("./block");
const {cryptoHash} = require("../util/");
const Wallet = require("../wallet");
const Transaction = require("../wallet/transaction");

describe("Blockchain", () => {
    let blockchain, newChain, originalChain, errorMock;

    beforeEach(() => {
        blockchain = new Blockchain(); //makes a new instance of blockchain object before each describe
        newChain = new Blockchain(); // will be used for chain replacement

        originalChain = blockchain.chain;

        errorMock = jest.fn();
        global.console.error = errorMock;
    });

    it("contains a `chain` Array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block to the chain", () => {
        const newData = "foo bar";
        blockchain.addBlock({ data: newData }); // we are adding an object with fields that are contained a Block object

        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
            newData
        );
    });

    describe("isValidChain()", () => {
        describe("when the chain does not start with the genesis block", () => {
            it("returns false", () => {
                blockchain.chain[0] = { data: "fake-genesis" };

                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false); // calling it on class as it is a static method, not on the instance
            });
        });

        describe("when the chain starts with the genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock({ data: "Lions" });
                blockchain.addBlock({ data: "Tigers" }); // adding blocks  to the chain to test
                blockchain.addBlock({ data: "Zebras" }); //using before each so does not have to be done in each describe
            });
            describe("and a lastHash reference has changed", () => {
                it("returns false", () => {
                    blockchain.chain[2].lastHash = "broken-lastHash";
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    ); // this should result in a broken lastHash reference
                });
            });

            describe("and the chain contains a block with and invalid field", () => {
                it("returns false", () => {
                    blockchain.chain[2].data = "changed data"; // changing a field like this should invalidate the block
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("and the chain contains a block with a jumped difficulty", () => {
                it("returns false", () => {
                    const lastBlock =
                        blockchain.chain[blockchain.chain.length - 1];

                    const lastHash = lastBlock.hash;

                    const timestamp = Date.now;

                    const nonce = 0;

                    const data = [];

                    const difficulty = lastBlock.difficulty - 3;

                    const hash = cryptoHash(
                        timestamp,
                        lastHash,
                        difficulty,
                        nonce,
                        data
                    );

                    const badBlock = new Block({
                        timestamp,
                        lastHash,
                        hash,
                        nonce,
                        difficulty,
                        data,
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("and the chain does not contain any invalid blocks", () => {
                it("returns true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        true
                    );
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let errorMock;
        let logMock;

        beforeEach(() => {
            errorMock = jest.fn(); //creates temporary methods for tests
            logMock = jest.fn();

            global.console.error = errorMock; // new functionality for replace chain log and error
            global.console.log = logMock;
        });

        describe("when the new chain is not longer", () => {
            beforeEach(() => {
                newChain.chain[0] = { new: "chain" };

                blockchain.replaceChain(newChain.chain);
            });
            it("does not replace the chain", () => {
                //the new chain is the same length but different

                expect(blockchain.chain).toEqual(originalChain);
            });
            it("logs an error", () => {
                expect(errorMock).toHaveBeenCalled(); // check that an error has been logged, same as below
            });
        });

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "Lions" });
                newChain.addBlock({ data: "Tigers" }); // adding blocks  to the chain to test
                newChain.addBlock({ data: "Zebras" });
            });
            describe("and the chain is invalid", () => {
                beforeEach(() => {
                    newChain.chain[2].hash = "420xXfake-HashXx420";

                    blockchain.replaceChain(newChain.chain);
                });
                it("does not replace the chain", () => {
                    expect(blockchain.chain).toEqual(originalChain);
                });
                it("logs an error", () => {
                    expect(errorMock).toHaveBeenCalled(); // check that an error has been logged
                });
            });

            describe("and the chain is valid", () => {
                beforeEach(() => {
                    blockchain.replaceChain(newChain.chain);
                });
                it("replaces the chain", () => {
                    expect(blockchain.chain).toEqual(newChain.chain);
                });

                it("logs about the chain replacement", () => {
                    expect(logMock).toHaveBeenCalled(); // check console log has been called
                });
            });
        });
    });

    describe('validTransactionData()', () =>{
        let transaction, rewardTransaction, wallet;


        beforeEach(() => {
            wallet = new Wallet();
            transaction = wallet.createTransaction({recipient: 'foo-address', amount: 165});
            rewardTransaction = Transaction.rewardTransaction({minerWallet: wallet});


        });

        describe('and the transaction data is valid', () =>{
            it('returns true', () =>{
                newChain.addBlock({data: [transaction, rewardTransaction]});

                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(true)

                expect(errorMock).not.toHaveBeenCalled();
            });
        });

        describe('and the transaction data has multiple rewards', () =>{
            it('returns false and logs an error', () =>{
                newChain.addBlock({data: [transaction, rewardTransaction, rewardTransaction]});

                expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);

                expect(errorMock).toHaveBeenCalled();
            });
        });

        describe('and the transaction data has at least malformed outputMap', () =>{
            describe('and the transaction is not a reward transaction', () =>{
                it('returns false and logs an error', () =>{
                    transaction.outputMap[wallet.publicKey] = 999999;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);

                    expect(errorMock).toHaveBeenCalled();
                });
            });
       

            describe('and the transaction is a reward transaction', () =>{
                it('returns false and logs an error', () =>{
                    rewardTransaction.outputMap[wallet.publicKey] = 999999;

                    newChain.addBlock({data: [transaction, rewardTransaction]});

                    expect(blockchain.validTransactionData({chain: newChain.chain})).toBe(false);

                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
        
        describe('and the transaction data has at least one malformed input', () =>{
            it('returns false and logs an error', () =>{

             
            });
        });

        describe('and a block contains multiple identical transactions', () =>{
            it('returns false', () =>{

            }); 
        });


    });
});
