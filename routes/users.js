var express = require('express');
var router = express.Router();
const UserBroker = require('../Brokers/UserBroker');

/* GET users listing. */
router.get('/', async function (req, res, next) {
  let result = UserBroker.findByEmail("email");
  console.log(result);
});

module.exports = router;
