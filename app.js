let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let session = require('express-session');
let flash = require('connect-flash');
let mongoClient = require('mongodb').MongoClient;

let indexRouter = require('./routes/index');
let dashboardRouter = require('./routes/dashboard');
let walletsRouter = require('./routes/wallets');
let marketRouter = require('./routes/market');
let transactionsRouter = require('./routes/transactions');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');

let app = express();

const oneDay = 1000 * 60 * 60 * 24;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(session({
  secret: "sdfbdmesecret123asgghjregv",
  saveUninitialized:true,
  cookie: { maxAge: oneDay },
  resave: false
}));
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/wallets', walletsRouter);
app.use('/market', marketRouter);
app.use('/transactions', transactionsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).render('error404');
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
