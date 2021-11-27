class Account {
    wallets = [];
    constructor(data) {
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.email = data.email;
        this.phone = data.phone;
        this.password = data.password;
        this.wallets = data.wallets || [];
    }

    verifyPassword(password) {
        const passwordHash = require('password-hash');
        return passwordHash.verify(password, this.password);
    }

    fullName() {
        return this.firstname + " " + this.lastname;
    }
}

exports.Account = Account;