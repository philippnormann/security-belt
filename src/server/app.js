'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const teams = require('./routes/teams');
const leaderboard = require('./routes/leaderboard');
const skill = require('./routes/skill');
const api = require('./routes/api');
const badges = require('./routes/badges');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '..','client', 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, '..', '..', 'public', 'favicon.ico')));
app.use(morgan('combined'));
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
app.use('/badges', badges.router);

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

function startServer(config) {
  app.set('port', config.server.httpPort);

  app.listen(app.get('port'), async () => {
    try {
      console.log('Connected to mongoDB');
    } catch(ex) {
      console.log('Failed to connect to mongoDB: ', ex);
    }
    console.log(`Server listening on http://localhost:${app.get('port')}`);
  });
}

exports.startServer = startServer;
exports.app = app;
