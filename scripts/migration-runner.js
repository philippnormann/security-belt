#!/usr/bin/env node

'use strict';
const MongoClient = require('mongodb').MongoClient;
const walk = require('walk');
const dbUser = process.env['DB_USER'];
const dbPassword = process.env['DB_PASS'];
const dbCollection = process.env['DB_COLLECTION'];
const dbHost = process.env['DB_HOST'] || 'localhost';
const dbURL = (dbUser && dbPassword) ?
  `mongodb://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPassword)}@${dbHost}/${dbCollection}?authMechanism=DEFAULT` :
  (dbCollection) ? `mongodb://${dbHost}/${dbCollection}` : `mongodb://${dbHost}`;

let db;
let collection;
let migrationNames = [];

function connectToDB() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbURL).then((connection) => {
      db = connection;
      collection = db.collection('belt');
      resolve();
    }).catch((err) => reject(err));
  });
}

function readMigrations() {
  return new Promise((resolve, reject) => {
    const walker = walk.walk(__dirname + '/migrations');
    walker.on('file', (root, fileStats, next) => {
      if (fileStats.name.endsWith('.js'))
        migrationNames.push(fileStats.name);
      next();
    });
    walker.on('errors', (root, nodeStatsArray, next) =>
      next()
    );
    walker.on('end', () => {
      migrationNames.sort();
      migrationNames.length > 0 ? resolve() : reject();
    });
  });
}

function runMigrations() {
  let migrationPromises = migrationNames.map((migration) => {
    const script = require('./migrations/' + migration);
    if (script.checkDB && script.migrateDB)
      return script.checkDB(collection)
        .then(() => {
          console.log(`Applied ${migration}`);
          return script.migrateDB(collection);
        }).catch(() => {
          console.log(`Skipped ${migration}`);
          return Promise.resolve();
        });
    else
      return Promise.reject();
  });
  return Promise.all(migrationPromises);
}

readMigrations()
  .then(() => connectToDB())
  .then(() => runMigrations())
  .then(() => db.close())
  .catch((err) => {
    console.error(err);
    if (db)
      db.close();
  });
