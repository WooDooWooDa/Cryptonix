var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        res.redirect('/login');
    }
    let account = req.session.account;
    console.log(account.wallets);
    res.render('dashboard', {
        title: "Dashboard",
        totalBalance: calculateTotalBalance(),
        account: account,
        wallets: account.wallets
    });
});

function calculateTotalBalance() {
    return 103.34;
}

module.exports = router;