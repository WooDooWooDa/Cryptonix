class Transaction {
    action = "sent";
    date;
    status = true;
    constructor(crypto, amount) {
        this.crypto = crypto;
        this.amount = amount;
    }
}

exports.Transaction = Transaction;