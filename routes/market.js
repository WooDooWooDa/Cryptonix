var express = require('express');
const {MongoClient: mongoClient} = require("mongodb");
const { check,validationResult } = require('express-validator');
const fetch = require('node-fetch');
const {log} = require("debug");
const {Transaction, Action} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').find().toArray(function (err, result) {
            if (err) throw err;
            client.close();
            res.render('market', {
                title: "Market",
                account: req.session.account,
                markets: result
            });
        });
    });
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    const currentCrypto = req.params.crypto;
    res.render('singleMarket', {
        title: req.params.crypto,
        account: req.session.account,
        crypto: currentCrypto
    });
});

router.get('/:crypto/value', function (req, res) {
    let amount = req.query.amount;
    if (amount < 0) {
        return res.json({value: 0});
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').findOne({symbol: req.query.from}).then(function (result) {
            let fromValue = result.value;
            db.collection('crypto').findOne({symbol: req.params.crypto}).then(function (result) {
                client.close();
                let toValue = result.value;
                return res.json({value: ((amount * fromValue) / toValue).toFixed(4)});
            });
        });
    });
});

router.post('/:crypto/buy',
    check('amount', 'The amount must be a valid numeric positive value').trim().escape().isFloat({gt: 0}),
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('form', req.body);
        return res.redirect('/wallets/' + req.params.crypto + '#buy');
    }

    let account = req.session.account;
    let wallets = account.wallets;

    if (wallets[0].balance < req.body.amount) {
        req.flash('errors', {msg: "You don't have enough FIAT to make this transaction"});
        req.flash('form', req.body);
        return res.redirect('/wallets/' + req.params.crypto + '#buy');
    }

    fetch('http://10.10.4.37:3000/market/' + req.params.crypto + '/value?amount=' + req.body.amount + "&from=FIAT")
        .then(result => result.json())
        .then(json => {
            if (json.value <= 0) {
                req.flash('errors', {msg: "You can't buy this amount of " + req.params.crypto});
                req.flash('form', req.body);
                return res.redirect('/wallets/' + req.params.crypto + '#buy');
            }
            wallets = buy(wallets, req.params.crypto, json.value);
            wallets = sell(wallets, "FIAT", req.body.amount, true);
            mongoClient.connect('mongodb://localhost:27017', function(err, client) {
                if (err) reject(err);
                let db = client.db('cryptonix');
                db.collection('users').updateOne({email: account.email}, {$set: {wallets: wallets}}).then(function (result) {
                    if (err) throw err;
                    client.close();
                    res.redirect("/wallets/" + req.params.crypto)
                });
            });
        })
});

router.post('/:crypto/sell',
    check('amount', 'The amount must be a valid numeric positive value').trim().escape().isFloat({gt: 0}),
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('form', req.body);
        return res.redirect('/wallets/' + req.params.crypto + '#sell');
    }

    let account = req.session.account;
    let wallets = account.wallets;

    if (wallets[getWalletIndex(wallets, req.params.crypto)].balance < req.body.amount) {
        req.flash('errors', {msg: "You don't have enough " + req.params.crypto + " to make this transaction"});
        req.flash('form', req.body);
        return res.redirect('/wallets/' + req.params.crypto + '#sell');
    }

    fetch('http://10.10.4.37:3000/market/FIAT/value?amount=' + req.body.amount + "&from=" + req.params.crypto)
        .then(result => result.json())
        .then(json => {
            if (json.value <= 0) {
                req.flash('errors', {msg: "You can't sell this amount of " + req.params.crypto});
                req.flash('form', req.body);
                return res.redirect('/wallets/' + req.params.crypto + '#buy');
            }
            wallets = buy(wallets, "FIAT", json.value, true);
            wallets = sell(wallets, req.params.crypto, req.body.amount);
            mongoClient.connect('mongodb://localhost:27017', function(err, client) {
                if (err) reject(err);
                let db = client.db('cryptonix');
                db.collection('users').updateOne({email: account.email}, {$set: {wallets: wallets}}).then(function (result) {
                    if (err) throw err;
                    client.close();
                    res.redirect("/wallets/" + req.params.crypto)
                });
            });
        })
});

function buy(wallets, crypto, amount, isReverse) {
    let index = getWalletIndex(wallets, crypto);
    let newBalance = (parseFloat(wallets[index].balance) + parseFloat(amount)).toFixed(4);
    return adjustWallets(wallets, newBalance, index, amount, Action.BOUGHT, crypto, isReverse);
}

function sell(wallets, crypto, amount, isReverse) {
    let index = getWalletIndex(wallets, crypto);
    let newBalance = parseFloat(wallets[index].balance) - parseFloat(amount);
    return adjustWallets(wallets, newBalance, index, amount, Action.SOLD, crypto, isReverse);
}

function adjustWallets(wallets, newBalance, index, amount, action, crypto, isReverse) {
    wallets[index].balance = newBalance;
    wallets[index].balanceHistory = adjustBalanceHistory(wallets[index].balanceHistory, newBalance);
    if (!isReverse)
        wallets[index].transactions.push(new Transaction(getCrypto(crypto), parseFloat(amount), action, wallets[index].address));
    return wallets;
}

function adjustBalanceHistory(history, newBalance) {
    history = history.slice(1);
    history.push(newBalance);
    return history;
}

function getWalletIndex(wallets, crypto) {
    let index = null;
    wallets.forEach(function (wallet, i) {
        if (wallet.crypto.symbol === crypto) {
            index = i;
        }
    })
    return index;
}

function getCrypto(crypto) {
    let cryptoTemp = null;
    for (const [key, value] of Object.entries(Crypto)) {
        if (key == crypto) {
            cryptoTemp = value;
        }
    }
    return cryptoTemp;
}

module.exports = router;