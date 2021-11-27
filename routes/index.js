var express = require('express');
const { check,validationResult } = require('express-validator');
const { Account } = require('../models/Account');
const passwordHash = require('password-hash');
const {MongoClient: mongoClient} = require("mongodb");
const {Wallet} = require("../models/Wallet");
const {Crypto} = require("../models/Cryptos");
var router = express.Router();


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
          if (req.body.password === "password-is-good")
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

  login(req, res);
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
          if (value === "email-deja-used")
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

  req.session.account = insertAccount(req.body);
  req.session.isLogged = true;
  res.redirect('/dashboard');
});

router.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});

//functions
function login(req, res) {
  mongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) reject(err);
    let db = client.db('cryptonix');
    db.collection('users').findOne({email: req.body.email}, {_id: false}).then(function (data) {
      if (err) throw err;
      client.close();
      if (data == null) {
        console.log("account not found");
        return wrongCredentials(req, res);
      } else {
        var account = new Account(data);
        if (!account.verifyPassword(req.body.password)) {
          console.log("password invalid");
          return wrongCredentials(req, res);
        }
      }
      req.session.account = account;
      req.session.isLogged = true;
      res.redirect('/dashboard');
    });
  });
}

function insertAccount(data) {
  data.password = passwordHash.generate(data.password, {algorithm: 'sha256', saltLength: 32})
  let account = new Account(data);
  account.wallets.push(new Wallet(Crypto.FIAT))
  mongoClient.connect('mongodb://localhost:27017', function(err, client) {
    if (err) reject(err);
    let db = client.db('cryptonix');
    db.collection('users').insertOne(account, function (err, result) {
      if (err) throw err;
      client.close();
    })
  });
  return account;
}

function wrongCredentials(req, res) {
  req.flash('form', req.body);
  req.flash('errors', [{msg: "Invalid credentials..."}]);
  res.redirect("/login");
}

function onlyMsg(errors) {
  let data = [];
  if (errors.length === 0)
    return [];
  errors.forEach(elem => {
    data.push(elem.msg)
  });
  return data;
}

module.exports = router;