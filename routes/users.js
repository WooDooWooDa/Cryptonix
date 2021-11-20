var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  req.session.userId = 1;
  res.render("index");
});

module.exports = router;
