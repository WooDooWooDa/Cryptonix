var express = require('express');
const {MongoClient: mongoClient} = require("mongodb");
const {Crypto} = require("../models/Cryptos");
const {Action, Transaction} = require("../models/Transaction");
var router = express.Router();

router.post('/send',function (req, res) {
    if (req.body.amount <= 0 || req.body.amount == null) {
        res.statusCode = 400;
        return res.json();
    }
    if (getCrypto(req.body.crypto) == null) {
        res.statusCode = 401;
        return res.json();
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').findOne({wallets: {$elemMatch: {address: req.body.address}}}).then((result) => {
            if (result == null) {
                res.statusCode = 404;
            } else {
                let wallet = getWallet(result.wallets, req.body.crypto);
                if (wallet == null || wallet.address !== req.body.address) {
                    res.statusCode = 404;
                } else if (wallet.crypto.symbol !== req.body.crypto) {
                    res.statusCode = 402;
                } else {
                    let wallets = receive(result.wallets, req.body.amount, req.body.crypto, req.body.from);
                    db.collection('users').updateOne({wallets: {$elemMatch: {address: req.body.address}}}, {$set: {wallets: wallets}}).then(function (result) {
                        if (err) throw err;
                        client.close();
                        res.statusCode = 200;
                    });
                }
            }
            return res.json();
        });
    });
})

function receive(wallets, amount, crypto, from) {
    let index = getWalletIndex(wallets, crypto);
    let newBalance = parseFloat(wallets[index].balance) + parseFloat(amount);
    return adjustWallets(wallets, newBalance, index, amount, Action.RECEIVED, crypto, from);
}

function adjustWallets(wallets, newBalance, index, amount, action, crypto, from) {
    wallets[index].balance = newBalance;
    wallets[index].balanceHistory = adjustBalanceHistory(wallets[index].balanceHistory, newBalance);
    wallets[index].transactions.push(new Transaction(getCrypto(crypto), parseFloat(amount), action, from));
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

module.exports = router;
