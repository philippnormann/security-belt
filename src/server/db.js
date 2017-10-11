const { MongoClient } = require('mongodb');
const config = require('./config');

function getMongoUri({ host, database, collection, user, password }) {
  if(user && password) {
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?authMechanism=DEFAULT`;
  }
  return `mongodb://${host}/${collection}`;
}

/**
 * Singleton for storing the connection
 */
function Mongo() {
  let db = null;
  let collection = null;

  async function getConnection() {
    if(db && collection) {
      return collection;
    }

    db = await MongoClient.connect(getMongoUri(config.database));
    collection = db.collection(config.database.collection);
    return collection;
  }

  return {
    getConnection
  };
}

module.exports = Mongo();
