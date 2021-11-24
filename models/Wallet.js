var {Transaction} = require("./Transaction");

class Wallet {
    balance = 1000;
    value;
    address = "0x234890745398450345873450456568";
    balanceHistory = [0, 100, 120, 100, 100, 50, 50, 50];
    transactions;
    constructor(crypto, balance) {
        this.crypto = crypto;
        this.balance = balance;
        this.transactions = [new Transaction(this.crypto, 0.002), new Transaction(this.crypto, 0.01), new Transaction(this.crypto, 100233), new Transaction(this.crypto, 0.0043)];
    }
}

exports.Wallet = Wallet;