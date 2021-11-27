var {Transaction} = require("./Transaction");

class Wallet {
    balance;
    value = 0;
    address = "0x234890745398450345873450456568";
    balanceHistory = [0];
    transactions = [];
    constructor(crypto, balance = 0) {
        this.crypto = crypto;
        this.balance = balance;
    }
}

exports.Wallet = Wallet;