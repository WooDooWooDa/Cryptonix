var express = require('express');
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    const transactions = [new Transaction(Crypto.BTC, 0.002), new Transaction(Crypto.ETH, 0.01), new Transaction(Crypto.ADA, 100233), new Transaction(Crypto.ETH, 0.0043)];
    res.render('dashboard', {
        title: "Dashboard",
        account: req.session.account,
        transactions: transactions,
        wallets: ["FIAT","BTC","ETH","ADA","SAFE"]
    });
});

module.exports = router;