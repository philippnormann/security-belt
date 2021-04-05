const path = require('path');

const config = {
  server: {
    httpPort: process.env.PORT || 3000,
    publicPath: path.resolve(__dirname, '../public'),
    views: path.resolve(__dirname, 'views')
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1:27017',
    database: process.env.DB_NAME || 'security-belt',
    collection: process.env.DB_COLLECTION || 'belt',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    uri: process.env.DB_URI
  },
  data: {
    skills: path.resolve(__dirname, '../config/skills'),
    badges: path.resolve(__dirname, '../config/badges'),
    teams: path.resolve(__dirname, '../config/teams.json')
  }
};

module.exports = config;
