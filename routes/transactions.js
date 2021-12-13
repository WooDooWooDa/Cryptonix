var express = require('express');
var router = express.Router();
const {MongoClient: mongoClient} = require("mongodb");
const {Action} = require("../models/Transaction");

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('users').findOne({email: req.session.account.email}).then(function (result) {
            client.close();
            res.render('transactions', {
                title: "Transactions",
                account: req.session.account,
                actions: Action,
                transactions: getTransactions(result.wallets).sort((a, b) => {
                    return new Date(b.date) - new Date(a.date);
                }),
            });
        })
    });
});

function getTransactions(wallets) {
    let transactions = [];
    wallets.forEach(wallet => {
        wallet.transactions.forEach(transaction => {
            transactions.push(transaction);
        })
    })
    return transactions;
}

module.exports = router;