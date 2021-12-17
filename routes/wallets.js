var express = require('express');
var router = express.Router();
const {MongoClient: mongoClient} = require("mongodb");
const {Wallet} = require("../models/Wallet");
const {check, validationResult} = require("express-validator");
const {Transaction, Action} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
const qr = require("qrcode");
const axios = require('axios');
const {response} = require("express");

router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').find().toArray(function (err, result) {
            if (err) throw err;
            let markets = result;
            db.collection('users').findOne({email: req.session.account.email}).then(function (result) {
                if (err) throw err;
                client.close();
                let account = result
                req.session.account = account;
                let wallets = account.wallets;
                res.render('wallets', {
                    title: "Wallets",
                    account: account,
                    wallets: wallets,
                    markets: markets,
                    messages: onlyMsg(req.flash('errors'))
                });
            });
        });
    });
});

router.post('/send',
    check('amount', 'The amount must be a valid numeric positive value').trim().escape().isFloat({gt: 0}),
    check('addressTo', 'Address must be 64 characters of length').trim().escape().isLength({min: 64, max: 64}),
    function (req, res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.redirect('/wallets/' + req.body.crypto);
    }

    axios.post("http://206.167.241." + req.body.bank + "/api/send/" + req.body.crypto, {
        amount: req.body.amount,
        address: req.body.addressTo,
        fromAddress: req.body.from
    }).then(response => {
        mongoClient.connect('mongodb://localhost:27017', function(err, client) {
            if (err) reject(err);
            let db = client.db('cryptonix');
            let wallets = req.session.account.wallets;
            wallets = send(wallets, req.body.crypto, req.body.amount, req.body.addressTo);
            db.collection('users').updateOne({email: req.session.account.email}, {$set: {wallets: wallets}}).then(r => {
                client.close();
            });
            return res.redirect('/wallets');
        });
    }).catch(error => {
        req.flash('errors', [{msg: sendError(error.response.status)}]);
        return res.redirect('/wallets');
    });
});

router.post('/add', function (req, res) {
    let wallets = req.session.account.wallets
    let haveIt = false;
    if (req.body.symbol === null) {
        req.flash('errors', [{msg: "Invalid crypto wallet option..."}]);
        return res.redirect('/wallets');
    }
    wallets.forEach(wallet => {
       if (wallet.crypto.symbol === req.body.symbol) {
           haveIt = true;
           req.flash('errors', [{msg: "You already have a " + req.body.symbol + " wallet in your account"}]);
       }
    });
    if (haveIt) {
        return res.redirect('/wallets');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').findOne({symbol: req.body.symbol}, {_id: false}).then(function (result) {
            if (result == null) {
                client.close();
                req.flash('errors', [{msg: "Invalid crypto wallet option..."}]);
                return res.redirect('/wallets');
            }
            let newWallet = new Wallet(result);
            db.collection('users').updateOne({email: req.session.account.email}, {$push: {wallets: newWallet}}).then(r => {
                client.close();
                res.redirect('/wallets');
            });
        });
    });
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    var account = req.session.account;
    let wallet = getWallet(account.wallets, req.params.crypto);
    if (wallet === null) {
        req.flash('errors', [{msg: "Invalid crypto wallet..."}]);
        res.redirect("/wallets");
        return;
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('bank').find().toArray(function (err, result) {
            if (err) throw err;
            client.close();
            res.render('singleWallet', {
                title: req.params.crypto,
                account: account,
                wallet: format(wallet),
                transactions: (wallet.transactions).sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                }).slice(0, 6),
                messages: onlyMsg(req.flash('errors')),
                banks: result
            });
        });
    });
});

router.post('/buyFiat',
    check('amount', 'The amount must be a valid numeric positive value').trim().escape().isInt({min: 1}),
    check('name', 'Name is required').trim().escape().notEmpty(),
    check('cardNumber', 'Card number must be valid').trim().escape().isLength({min: 16, max: 16}).isNumeric(),
    check('expiration', 'Expiration date must be valid').isDate(),
    check('cvv', 'CVV must be valid').isLength({min: 3, max: 3}).isNumeric(),
    (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        req.flash('form', req.body);
        return res.redirect('/wallets/FIAT#buy');
    }
    let account = req.session.account;
    let wallets = account.wallets;
    let newBalance = parseInt(wallets[0].balance) + parseInt(req.body.amount);
    wallets[0].balance = newBalance;
    wallets[0].balanceHistory = adjustBalanceHistory(account.wallets[0].balanceHistory, newBalance);
    wallets[0].transactions.push(new Transaction(Crypto.FIAT, req.body.amount, Action.BOUGHT, account.wallets[0].address));
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').updateOne({email: account.email}, {$set: {wallets: wallets}}).then(function (result) {
            if (err) throw err;
            client.close();
            res.redirect("/wallets/FIAT")
        });
    });
});

router.get('/:crypto/history', function (req, res) {
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').findOne({email: req.session.account.email}).then(function (result) {
            client.close();
            let wallet = getWallet(result.wallets, req.params.crypto)
            res.json(wallet.balanceHistory)
        });
    });
});

function format(wallet) {
    let walletString = wallet.balance.toString();
    if (walletString.length > 10) {
        wallet.balance = walletString.slice(0, 10) + "...";
    }
    return wallet;
}

function send(wallets, crypto, amount, to) {
    let index = getWalletIndex(wallets, crypto);
    let newBalance = parseFloat(wallets[index].balance) - parseFloat(amount);
    return adjustWallets(wallets, newBalance, index, amount, Action.SENT, crypto, to);
}

function adjustWallets(wallets, newBalance, index, amount, action, crypto, to) {
    wallets[index].balance = newBalance;
    wallets[index].balanceHistory = adjustBalanceHistory(wallets[index].balanceHistory, newBalance);
    wallets[index].transactions.push(new Transaction(getCrypto(crypto), parseFloat(amount), action, to));
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

function getWallet(wallets, crypto) {
    let returnedWallet = null;
    wallets.forEach(wallet => {
        if (wallet.crypto.symbol === crypto) {
            returnedWallet = wallet
        }
    })
    return returnedWallet;
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

function onlyMsg(errors) {
    let data = [];
    if (errors.length === 0)
        return [];
    errors.forEach(elem => {
        data.push(elem.msg)
    });
    return data;
}

function sendError(code) {
    switch (code) {
        case 404: return "Crypto address not found..."
        case 401: return "Invalid crypto option..."
        case 400: return "Invalid amount..."
        case 402: return "Invalid crypto for address..."
        case 500: return "Bank Api internal error, try later..."
        default: return "An error as occurred, try later..."
    }
}

function countDecimals(number) {
    if(Math.floor(number.valueOf()) === number.valueOf()) return 0;
    return number.toString().split(".")[1].length || 0;
}

module.exports = router;