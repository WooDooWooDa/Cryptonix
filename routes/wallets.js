var express = require('express');
var router = express.Router();
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
const {Wallet} = require("../models/Wallet");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    let wallets = [new Wallet(Crypto.FIAT, 200), new Wallet(Crypto.ETH, 0.002), new Wallet(Crypto.BTC, 0.00004), new Wallet(Crypto.ADA, 1020003)];
    res.render('wallets', {
        title: "Wallets",
        account: req.session.account,
        wallets: wallets
    });
});

router.get('/add', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    res.render('addWallet', {
        title: req.params.crypto,
        account: req.session.account
    });
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    let wallet = new Wallet(Crypto[req.params.crypto], 1002);
    res.render('singleWallet', {
        title: req.params.crypto,
        account: req.session.account,
        wallet: wallet,
        transactions: wallet.transactions
    });
});

router.get('/:crypto/history', function (req, res) {
    let wallet = new Wallet(Crypto[req.params.crypto], 1002);
    res.json(wallet.balanceHistory)
});

module.exports = router;