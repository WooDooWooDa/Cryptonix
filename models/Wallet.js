var coinKey = require('coinkey');
var ci = require('coininfo');

class Wallet {
    balance;
    value = 0;
    address;
    balanceHistory = [0,0,0,0,0,0,0,0,0,0];
    transactions = [];
    constructor(crypto, balance = 0) {
        this.crypto = crypto;
        this.balance = balance;
        this.address = coinKey.createRandom(ci((crypto.symbol).toLowerCase())).key.toString('hex');
    }
}

exports.Wallet = Wallet;