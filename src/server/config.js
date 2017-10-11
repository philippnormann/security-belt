const config = {
  server: {
    httpPort: process.env.PORT || 3000
  },
  database: {
    host: process.env.DB_HOST || '127.0.0.1:27017',
    database: process.env.DB_NAME || 'security-belt',
    collection: process.env.DB_COLLECTION || 'belt',
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  }
};

module.exports = config;
