var express = require('express');
const { body,validationResult } = require('express-validator');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/login',(req,res) => {
  if (req.session.isLogged) {
    res.redirect('/dashboard');
  }
  res.render('login', {title: "login"});
});

router.post('/login',
    body('username', 'Username is required').trim().escape().isLength({ min: 2 }),
    body('password', 'Password is required').isLength({ min: 2 }),
    (req,res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.redirect('/login');
  }
  req.session.isLogged = true;
  res.redirect('/dashboard');
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
