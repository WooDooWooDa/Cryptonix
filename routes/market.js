var express = require('express');
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
const {MongoClient: mongoClient} = require("mongodb");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').find().toArray(function (err, result) {
            if (err) throw err;
            client.close();
            console.log(result);
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
        res.redirect('/login');
    }
    const currentCrypto = req.params.crypto;
    res.render('singleMarket', {
        title: req.params.crypto,
        account: req.session.account,
        crypto: currentCrypto
    });
});

module.exports = router;