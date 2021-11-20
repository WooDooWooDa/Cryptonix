class Account {
    constructor(firstname, lastname) {
        this.firstname = firstname;
        this.lastname = lastname;
    }

    fullName() {
        return this.firstname + " " + this.lastname;
    }
}

exports.Account = Account;