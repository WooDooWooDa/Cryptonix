var express = require('express');
var router = express.Router();
const {MongoClient: mongoClient} = require("mongodb");
const {Wallet} = require("../models/Wallet");
const {check, validationResult} = require("express-validator");
const {Transaction, Action} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
        return;
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').findOne({email: req.session.account.email}).then(function (result) {
            if (err) throw err;
            client.close();
            req.session.account = result;
            res.render('wallets', {
                title: "Wallets",
                account: result,
                wallets: result.wallets
            });
        });
    });
});

router.get('/add', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
        return;
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
                markets: result,
                messages: onlyMsg(req.flash('errors'))
            });
        });
    });
});

router.post('/add', function (req, res) {
    let wallets = req.session.account.wallets
    let haveIt = false;
    wallets.forEach(wallet => {
       if (wallet.crypto.symbol === req.body.symbol) {
           haveIt = true;
           req.flash('errors', [{msg: "You already have a " + req.body.symbol + " wallet in your account"}]);
       }
    });
    if (haveIt) {
        res.redirect('/wallets/add');
        return;
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').findOne({symbol: req.body.symbol}, {_id: false}).then(function (result) {
            let newWallet = new Wallet(result);
            let db = client.db('cryptonix');
            db.collection('users').updateOne({email: req.session.account.email}, {$push: {wallets: newWallet}}).then(r => {
                client.close();
                res.redirect('/wallets');
            });
        });
    });
});

router.get('/:crypto', function (req, res) {
    if (!req.session.isLogged) {
        res.redirect('/login');
        return;
    }
    var account = req.session.account;
    let wallet = getWallet(account.wallets, req.params.crypto);
    if (wallet === null) {
        res.redirect("/wallets");
        return;
    }
    res.render('singleWallet', {
        title: req.params.crypto,
        account: account,
        wallet: wallet,
        transactions: wallet.transactions,
        messages: onlyMsg(req.flash('errors'))
    });
});

router.post('/buyFiat',
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
    let newBalance = parseInt(account.wallets[0].balance) + parseInt(req.body.amount);
    account.wallets[0].balance = newBalance;
    account.wallets[0].balanceHistory = adjustBalanceHistory(account.wallets[0].balanceHistory, newBalance);
    account.wallets[0].transactions.push(new Transaction(Crypto.FIAT, req.body.amount, Action.BOUGHT, account.wallets[0].address));
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').updateOne({email: account.email}, {$set: account}).then(function (result) {
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
            if (err) throw err;
            client.close();
            let wallet = getWallet(result.wallets, req.params.crypto)
            res.json(wallet.balanceHistory)
        });
    });
});

function newTransaction(wallet, action) {

}

function adjustBalanceHistory(history, newBalance) {
    history = history.slice(1);
    history.push(newBalance);
    return history;
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

function onlyMsg(errors) {
    let data = [];
    if (errors.length === 0)
        return [];
    errors.forEach(elem => {
        data.push(elem.msg)
    });
    return data;
}

module.exports = router;