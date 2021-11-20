var express = require('express');
var router = express.Router();
var { Crypto } = require('../models/Cryptos');
const {Transaction} = require("../models/Transaction");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    const transactions = [new Transaction(Crypto.BTC, 0.002), new Transaction(Crypto.ETH, 0.01), new Transaction(Crypto.SHIB, 100233)];
    console.log(transactions);
    res.render('transactions', {
        title: "Transactions",
        account: req.session.account,
        transactions: transactions
    });
});

module.exports = router;