const skills = require('./skills');
const config = require('./config');
const teams = require(config.data.teams).teams;
const Mongo = require('./db');

async function getTeamGraph(key, days) {
  const collection = await Mongo.getConnection();
  const res = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const cursor = await collection.aggregate([
      {
        $match: {
          _id: key
        }
      },
      {
        $project: {
          skills: {
            $filter: {
              input: '$skills',
              as: 'skill',
              cond: { $lte: ['$$skill.since', d]}
            }
          }
        }
      },
      {
        $project: {
          skillCount: { $size: '$skills' }
        }
      }
    ]);
    if (await cursor.hasNext()) {
      const doc = await cursor.next();
      const timeStamp = Math.floor(d.getTime() / 1000);
      res.push({ x: timeStamp, y: doc.skillCount || 0 });
    }
  }
  return res;
}

function getGraph(days){
  const summedGraph = [];
  const teamGraphs = [];
  teams.forEach((team) => {
    const teamGraph = getTeamGraph(team.key, days);
    teamGraphs.push(teamGraph);
  });
  return Promise.all(teamGraphs).then((resolvedGraphs) => {
    resolvedGraphs.forEach((team) => {
      team.forEach((day, i) => {
        if (summedGraph[i])
          summedGraph[i].y += day.y;
        else
          summedGraph.push(day);
      });
    });
    return Promise.resolve(summedGraph);
  }).then((res) => Promise.resolve(res));
}

function getTeams() {
  let allTeams = [];
  teams.map((team) => {
    allTeams.push(getTeam(team.key));
  });
  return Promise.all(allTeams);
}

async function getTeam(key) {
  const currentSkills = await teamSkills(key);
  const fileNames = await skills.getFileNames();
  const teamObj = teams.find((team) => team.key == key);
  const team = {
    key: teamObj.key,
    name: teamObj.name,
    champion: teamObj.champion,
    belt: belt(currentSkills, fileNames),
    skills: currentSkills,
    skillCount: currentSkills.length
  };
  return team;
}

function getTeamNames() {
  return teams.map((team) => team.key);
}

async function createTeam(key) {
  const collection = await Mongo.getConnection();
  if (getTeamNames().includes(key)) {
    const team = {_id: key, skills: []};
    return collection.insertOne(team);
  } else {
    return Promise.reject(Error('Team not found!'));
  }
}

async function teamSkills(key) {
  const collection = await Mongo.getConnection();
  const doc = await collection.findOne({ _id: key });
  if (doc) {
    return Promise.resolve(doc.skills);
  } else {
    await createTeam(key);
    return teamSkills(key);
  }
}

async function addToSkillSet(key, cardName) {
  const collection = await Mongo.getConnection();
  const doc = await collection.findOne({_id: key, skills: {$elemMatch: {name: cardName}}});
  if (doc) {
    return Promise.reject(Error('skill is already enabled'));
  }
  return collection.updateOne({_id: key}, {$push: {skills: {name: cardName, since: new Date()}}});
}

async function removeFromSkillSet(key, cardName) {
  const collection = await Mongo.getConnection();
  return collection.updateOne({_id: key}, {$pull: {skills: {name: cardName}}});
}

function toggleSkill(key, cardName) {
  return skills.getFlatFileNames().then((res) => {
    if (res.includes(cardName))
      return Promise.resolve(key);
    else
      return Promise.reject(Error(cardName + ' Skill not valid!'));
  }).then(teamSkills).then((res) => {
    if (res.find((skill) => skill.name == cardName))
      return removeFromSkillSet(key, cardName);
    else
      return addToSkillSet(key, cardName);
  });
}

function belt(teamSkills, fileNames) {
  let currBelt = 'white';
  for (let beltName in fileNames) {
    let len = fileNames[beltName].length;
    for (let i in fileNames[beltName]) {
      if (teamSkills.find((skill) => skill.name == fileNames[beltName][i])){
        if (i == len - 1)
          currBelt = beltName;
      } else {
        return currBelt;
      }
    }
  }
  return currBelt;
}

function getBadges() {
  const fs = require('fs');
  const yaml = require('js-yaml');
  const glob = require('glob');
  const badgePath = config.data.badges;
  return new Promise((resolve, reject) => {
    glob(`${badgePath}/**/*.yaml`, (err, files) => {
      if(err) {
        return reject(err);
      }
      const badges = files.map(f => {
        const b = yaml.safeLoad(fs.readFileSync(f, 'utf-8'));
        b.id = b.title.toLowerCase().replace(/\s+/, '-');
        return b;
      });

      return resolve(badges);
    });
  });
}

exports.getTeamGraph = getTeamGraph;
exports.getGraph = getGraph;
exports.getTeams = getTeams;
exports.getTeam = getTeam;
exports.getTeamNames = getTeamNames;
exports.teamSkills = teamSkills;
exports.addToSkillSet = addToSkillSet;
exports.removeFromSkillSet = removeFromSkillSet;
exports.toggleSkill = toggleSkill;
exports.belt = belt;
exports.getBadges = getBadges;
