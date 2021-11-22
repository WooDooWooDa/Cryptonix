var express = require('express');
const {Transaction} = require("../models/Transaction");
const {Crypto} = require("../models/Cryptos");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    res.render('market', {title: "Market", account: req.session.account});
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