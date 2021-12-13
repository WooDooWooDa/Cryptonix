var express = require('express');
const {MongoClient: mongoClient} = require("mongodb");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (!req.session.isLogged) {
        return res.redirect('/login');
    }
    let account = req.session.account;
    mongoClient.connect('mongodb://localhost:27017', function(err, client) {
        if (err) reject(err);
        let db = client.db('cryptonix');
        db.collection('crypto').find().toArray(function (err, result) {
            if (err) throw err;
            client.close();
            res.render('dashboard', {
                title: "Dashboard",
                totalBalance: calculateTotalBalance(account.wallets),
                account: account,
                wallets: account.wallets,
                markets: result
            });
        });
    });
});

function calculateTotalBalance(wallets) {
    return 0;
}

module.exports = router;