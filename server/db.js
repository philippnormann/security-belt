const { MongoClient } = require('mongodb');
const config = require('./config');

function getMongoUri({ host, database, user, password }) {
  if(user && password) {
    return `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?authMechanism=DEFAULT`;
  }
  return `mongodb://${host}/${database}`;
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

  async function closeConnection() {
    if (db)
      await db.close();
  }

  return {
    getConnection, 
    closeConnection    
  };
}

module.exports = Mongo();
