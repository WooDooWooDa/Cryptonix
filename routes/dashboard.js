var express = require('express');
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
const {Wallet} = require("../models/Wallet");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    let wallets = [new Wallet(Crypto.FIAT, 200), new Wallet(Crypto.ETH, 0.002), new Wallet(Crypto.BTC, 0.00004), new Wallet(Crypto.ADA, 1020003)];
    res.render('dashboard', {
        title: "Dashboard",
        totalBalance: 11250.50,
        account: req.session.account,
        wallets: wallets
    });
});

module.exports = router;