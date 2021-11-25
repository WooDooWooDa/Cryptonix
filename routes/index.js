var express = require('express');
const { check,validationResult } = require('express-validator');
const { Account } = require('../models/Account');
const UserBroker = require('../Brokers/UserBroker');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

router.get('/login',(req,res) => {
  if (req.session.isLogged) {
    res.redirect('/dashboard');
  }
  res.render('login', {
    title: "Log In",
    messages: onlyMsg(req.flash('errors')),
    form: req.flash('form')[0] || null
  });
});

router.post('/login',
    check('email', 'Email is required').trim().escape().notEmpty()
        .isEmail().withMessage('Email must be valid'),
    check('password', 'Password is required').trim().escape().notEmpty().withMessage('Password is required')
        .custom((value, { req }) => {
          if (req.body.password !== "password")
            throw new Error('Incorrect Password');
          return true;
        }),
    (req,res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    req.flash('form', req.body);
    return res.redirect('/login');
  }

  req.session.account = new Account('jérémie', 'login');
  req.session.isLogged = true;
  res.redirect('/dashboard');
});

router.get('/signup', (req, res) => {
  res.render('signup', {
    title: "Sign Up",
    messages: onlyMsg(req.flash('errors')),
    form: req.flash('form')[0] || null
  });
});

router.post('/signup',
    check('firstname', 'Firstname is required').trim().escape().notEmpty(),
    check('lastname', 'Lastname is required').trim().escape().notEmpty(),
    check('email', 'Email is required').trim().escape().notEmpty()
        .isEmail().withMessage('Email must be valid')
        .custom((value) => {
          if (value !== "email-deja-used")
            throw new Error('Email already used');
          return true;
        }),
    check('phone', 'Phone is required').trim().escape().notEmpty()
        .isMobilePhone("en-CA").withMessage('Phone must be valid'),
    check('password', 'Password is required').trim().escape().notEmpty(),
    (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    req.flash('form', req.body);
    return res.redirect('/signup');
  }

  req.session.account = new Account(req.body.firstname, req.body.lastname);
  req.session.isLogged = true;
  res.redirect('/dashboard');
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;

function onlyMsg(errors) {
  let data = [];
  if (errors.length === 0)
    return [];
  errors.forEach(elem => {
    data.push(elem.msg)
  });
  return data;
}