'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const bunyan = require('bunyan');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const teams = require('./routes/teams');
const leaderboard = require('./routes/leaderboard');
const skill = require('./routes/skill');
const api = require('./routes/api');
const badges = require('./routes/badges');
const Mongo = require('./db');
const config = require('./config');
const middleware = require('./middleware');
const app = express();
const rootLogger = bunyan.createLogger({
  name: 'securitybelt',
  level: process.env.SB_LOG_LEVEL || 'info',
  streams: [
    { stream: process.stdout, level: 'info' }
  ],
  serializers: bunyan.stdSerializers
});

if(process.env.SB_LOG_FILE) {
  rootLogger.addStream({ path: path.resolve(process.env.SB_LOG_FILE) });
}

function requestLoggerMiddleware(req, res, next) {
  if(!req.logger) {
    req.logger = rootLogger.child({ label: 'http' });
  }
  req.logger.info({ req });
  next();
}

function bindStatic(app, config) {
  app.set('views', config.server.views);
  app.set('view engine', 'pug');
  app.use(favicon(path.join(config.server.publicPath, 'favicon.ico')));
  app.use(express.static(config.server.publicPath));
}

function bindBase(app) {
  app.use(requestLoggerMiddleware);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false
  }));
}

bindBase(app);
bindStatic(app, config);

app.use(middleware.httpsRedirect);
app.use('/', index.router);
app.use('/teams', teams.router);
app.use('/skill', skill.router);
app.use('/leaderboard', leaderboard.router);
app.use('/api', middleware.cors);
app.use('/api', api.router);
app.use('/badges', badges.router);
app.use(middleware.notFound);
app.use(middleware.error);

function startServer(httpPort) {
  app.set('port', httpPort);

  app.listen(app.get('port'), async () => {
    try {
      await Mongo.getConnection();
      rootLogger.info('Connected to mongoDB');
    } catch(ex) {
      rootLogger.error({ err, msg: `failed to connect to database` });
    }
    rootLogger.info(`Server listening on http://localhost:${httpPort}`);
  });
}

exports.startServer = startServer;
exports.app = app;
