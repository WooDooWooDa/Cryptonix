var express = require('express');
var router = express.Router();
const {CanvasRenderService} = require('chartjs-node-canvas');
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    res.render('wallets', {
        title: "Wallets",
        account: req.session.account,
        lastTransaction: new Transaction(Crypto.ETH, 0.001)
    });
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    const transactions = [new Transaction(Crypto.BTC, 0.002), new Transaction(Crypto.ETH, 0.01), new Transaction(Crypto.ADA, 100233), new Transaction(Crypto.ETH, 0.0043)];
    res.render('singleWallet', {
        title: req.params.crypto,
        account: req.session.account,
        transactions: transactions
    });
});

module.exports = router;