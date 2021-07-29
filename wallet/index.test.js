const Wallet = require('./index');

describe('Wallet', () =>{
    let wallet;

    beforeEach(() =>{
        wallet = new Wallet();
    });

    it('has a balance', () =>{
        expect(wallet).toHaveProperty('balance');
    });

    it('has a public key', () =>{
        //console.log(wallet.publicKey)
        expect(wallet).toHaveProperty('publicKey');
        

    });

});