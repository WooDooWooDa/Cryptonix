var express = require('express');
var router = express.Router();
const {CanvasRenderService} = require('chartjs-node-canvas');

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    res.render('wallets', {title: "Wallets", account: req.session.account});
});

router.get('/:crypto', function (req, res) {
    res.render('singleWallet', {title: req.params.crypto, account: req.session.account});
});

module.exports = router;