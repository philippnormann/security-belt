'use strict';
function isMigrated(team) {
  return team.skills.every(skill => {
    return (skill.since instanceof Date);
  });
}

function checkDB(collection) {
  return new Promise((resolve, reject) => {
    collection.find().toArray().then((teams) => {
      if (teams.every(isMigrated))
        reject(Error('all teams are already migrated'));  
      else
        resolve();
    });
  });
}

function migrateTeam(team) {
  team.skills = team.skills.map((skill) => {
    return {
      name: skill.name, 
      since: new Date(skill.since)
    };
  });
  return team;
}

function migrateDB(collection) {
  return collection.find({ skills : { $ne: [] }})
    .toArray().then((teams) => {
      const migratedTeams = teams.map(migrateTeam);
      const promises = migratedTeams.map((team) => {
        return collection.replaceOne({ _id: team._id }, team);
      });
      return Promise.all(promises);
    });
}

exports.checkDB = checkDB;
exports.migrateDB = migrateDB;
