var express = require('express');
const {MongoClient: mongoClient} = require("mongodb");
const { check,validationResult } = require('express-validator');
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

router.get('/:crypto/value', function (req, res) {

});

router.post('/:crypto/buy',
     (req, res) => {


    res.redirect("/wallets/" + req.params.crypto)
});

router.post('/:crypto/sell', function (req, res) {
    console.log("selll")
    res.redirect("/wallets/" + req.params.crypto)
});

module.exports = router;