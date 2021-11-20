var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    res.render('wallets', {title: "Wallets", account: req.session.account});
});

module.exports = router;