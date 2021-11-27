var express = require('express');
var router = express.Router();
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
const {Wallet} = require("../models/Wallet");
const {MongoClient: mongoClient} = require("mongodb");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    var account = req.session.account;
    res.render('wallets', {
        title: "Wallets",
        account: account,
        wallets: account.wallets
    });
});

router.get('/add', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').find().toArray(function (err, result) {
            if (err) throw err;
            client.close();
            res.render('addWallet', {
                title: "Add a wallet",
                account: req.session.account,
                markets: result
            });
        });
    });
});

router.post('/add', function (req, res) {
    console.log("adding wallet to account");
    res.redirect('/wallets');
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    var account = req.session.account;
    //get the wallet according to the crypto
    res.render('singleWallet', {
        title: req.params.crypto,
        account: account,
        wallet: account.wallets[0],
        transactions: account.wallets[0].transactions
    });
});

router.get('/:crypto/history', function (req, res) {
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').find({email: req.session.account.email}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result)
            client.close();
            res.json([0, 0, 0, 0, 0, 0])
        });
    });
});

module.exports = router;