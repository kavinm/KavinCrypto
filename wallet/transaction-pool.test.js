const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const { intFromLE } = require('elliptic/lib/elliptic/utils');

describe('TransactionPool', () =>{
    let transactionPool, transaction, senderWallet;

    beforeEach(() =>{
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: 'fake-recipient',
            amount: 50

        });
    });

    describe('setTransaction()', () =>{
        it('adds a transaction', () =>{
            transactionPool.setTransaction(transaction);
            //toBe can be used with booleans or check if they are the same object instance
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () =>{
        it('returns an existing transaction given an input address', () =>{
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({inputAddress: senderWallet.publicKey})).toBe(transaction);

        });
    });
});