#!/usr/bin/env node

'use strict';
const walk = require('walk');
const Mongo = require('../server/db');

let migrationNames = [];

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

async function runMigrations() {
  const collection = await Mongo.getConnection();
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
  .then(() => runMigrations())
  .then(() => Mongo.closeConnection())
  .catch((err) => {
    console.error(err);
    Mongo.closeConnection();
  });
