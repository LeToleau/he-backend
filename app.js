var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const exphbs = require('express-handlebars');
require('dotenv').config();
const db = require('./models/dbConnection');
const favicon = require('serve-favicon');
const helmet = require('helmet');

var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// var loginRouter = require('./routes/admin/login');
var logoutRouter = require('./routes/admin/logout');
var apiRouter = require('./routes/api');
var publicLoginRouter = require('./routes/publicLogin');
// var exportPRouter = require('./routes/exportP');
// var exportWRouter = require('./routes/exportW');

var app = express();

// Configura CORS para permitir el origen específico
const corsOptions = {
  origin: 'http://localhost:5173', // Origen que quieres permitir
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Ruta al favicon
const faviconPath = path.join(__dirname, '/public/favicon.ico');
// Usar el middleware serve-favicon
app.use(favicon(faviconPath));

const hbs = exphbs.create({
  helpers: {
    getKeys: function (obj) {
      return obj ? Object.keys(obj) : [];
    }
  },
  extname: 'hbs',
  defaultLayout: false
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Configurar Helmet para usar CSP
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "trusted-scripts.com"],
    styleSrc: ["'self'", "trusted-styles.com"],
    imgSrc: ["'self'", "images.com"],
    connectSrc: ["'self'"],
    fontSrc: ["'self'", "fonts.com"],
    objectSrc: ["'none'"],
    frameSrc: ["'none'"],
    upgradeInsecureRequests: [],
  }
}));

app.use(session({
  secret: 'userIsLoggedAsYouShouldKnow',
  cookie: { maxAge: null },
  resave: false,
  saveUninitialized: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin/login', loginRouter);
app.use('/api', cors(), apiRouter);
app.use('/login', publicLoginRouter);

secured = async (req, res, next) => {
  var isLogged = req.session.isLogged;
  try {
    if (isLogged) {
      next();
    } else {
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error);
  }
}

app.use('/', secured, indexRouter);
app.use('/users', secured, usersRouter);
// app.use('/exportP', secured, exportPRouter);
// app.use('/exportW', secured, exportWRouter);
app.use('/admin/logout', secured, logoutRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

/*
app.listen(3000, () => {
  console.log('server running');
});
*/

module.exports = app;
