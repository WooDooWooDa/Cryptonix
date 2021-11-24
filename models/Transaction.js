class Transaction {
    action = "sent";
    date = "10:00, 23 Dec 2018";
    status = true;
    otherAddress = "0x234890745398450345873450456568";
    constructor(crypto, amount) {
        this.crypto = crypto;
        this.amount = amount;
    }
}

exports.Transaction = Transaction;