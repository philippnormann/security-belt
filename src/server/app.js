'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const teams = require('./routes/teams');
const leaderboard = require('./routes/leaderboard');
const skill = require('./routes/skill');
const api = require('./routes/api');

const state = require('./lib/state');

const app = express();

state.connectToDB().then(() =>
  console.log('Connection to mongoDB successful!')
).catch((err) => console.error(err));

// view engine setup
app.set('views', path.join(__dirname, '..','client', 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, '..', '..', 'public', 'favicon.ico')));
app.use(logger('short', {
  skip: (req, res) => res['_headers']['cache-control']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// redirect to https
app.use(function (req, res, next) {
  if (process.env.NODE_ENV !== 'production' || req.headers['x-forwarded-proto'] === 'https') {
    return next();
  }
  res.redirect('https://' + req.headers.host + req.url);
});

app.use(express.static(path.join(__dirname, '..', '..', 'public')));

app.use('/', index.router);
app.use('/teams', teams.router);
app.use('/skill', skill.router);
app.use('/leaderboard', leaderboard.router);
app.use('/api', api.router);

// catch 404
app.use(function (req, res) {
  res.locals.message = 'Sorry! Nothing here…';
  res.locals.error = {status: 404};
  res.status(404).render('error');
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
