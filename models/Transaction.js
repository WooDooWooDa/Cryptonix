const Action = {
    SENT: "sent",
    RECEIVED: "received",
    BOUGHT: "bought",
    SOLD: "sold",
}

class Transaction {
    action;
    date;
    status = true;
    otherAddress = "";
    constructor(crypto, amount, action ,address) {
        this.crypto = crypto;
        this.amount = amount;
        this.action = action;
        let date = new Date();
        this.date = date.toLocaleDateString() + " " +  date.toLocaleTimeString();
        this.otherAddress = address;
    }
}

exports.Transaction = Transaction;
exports.Action = Action;