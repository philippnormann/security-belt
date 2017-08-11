'use strict';
const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');
const walk = require('walk');

let skills;
let fileNames;

function read(skillsFolder) {
  return new Promise((resolve, reject) => {
    const walker = walk.walk(skillsFolder);
    let skills = {
      yellow: [],
      orange: [],
      green: [],
      blue: [],
      brown: [],
      black: []
    };
    walker.on('file', (root, fileStats, next) => {
      fs.readFile(root + '/' + fileStats.name, (err, data) => {
        if (err) reject(err);
        let rootSplit = root.split(path.sep);
        let beltName = rootSplit[rootSplit.length - 1];
        try {
          let skill = yaml.safeLoad(data);
          skill.fileName = fileStats.name.replace('.yml', '');
          skills[beltName].push(skill);
          next();
        } catch (err) {
          reject('Error while reading skill files: ' + err);
        }
      });
    });
    walker.on('errors', (root, nodeStatsArray, next) =>
      next()
    );
    walker.on('end', () =>
      resolve(skills)
    );
  });
}

function get() {
  return new Promise((resolve, reject) => {
    if (skills === undefined)
      read(__dirname + '/../../../config/skills').then((res) =>
        resolve(res)
      ).catch((err) =>
        reject(err)
      );
    else
      resolve(skills);
  });
}

function extractFileNames(skills) {
  let res = {};
  Object.keys(skills).map((beltName) => {
    res[beltName] = skills[beltName].map((skill) => {
      return skill.fileName;
    });
  });
  return res;
}

function getFileNames() {
  return new Promise((resolve, reject) => {
    if (fileNames === undefined)
      get().then((res) => {
        fileNames = extractFileNames(res);
        resolve(fileNames);
      }).catch((err) => reject(err));
    else
      resolve(fileNames);
  });
}

function getFlatFileNames() {
  return getFileNames().then((fileNames) => {
    let reducedFileNames = [];
    Object.keys(fileNames).map((belt) => {
      reducedFileNames = reducedFileNames.concat(fileNames[belt]);
    });
    return Promise.resolve(reducedFileNames);
  });
}

exports.get = get;
exports.read = read;
exports.extractFileNames = extractFileNames;
exports.getFileNames = getFileNames;
exports.getFlatFileNames = getFlatFileNames;
