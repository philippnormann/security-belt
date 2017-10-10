const skills = require('./skills');
const teams = require('../../config/teams.json').teams;
const Mongo = require('./db');

async function getTeamGraph(teamName, days) {
  const collection = await Mongo.getConnection();
  const res = [];
  for (let i = days-1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const cursor = await collection.aggregate([
      {
        $match: {
          _id: teamName
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
    const teamGraph = getTeamGraph(team.name, days);
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
    allTeams.push(getTeam(team.name));
  });
  return Promise.all(allTeams);
}

async function getTeam(teamName) {
  const currentSkills = await teamSkills(teamName);
  const fileNames = await skills.getFileNames();
  const teamObj = teams.find((team) => team.name == teamName);
  const team = {
    name: teamObj.name,
    champion: teamObj.champion,
    belt: belt(currentSkills, fileNames),
    skills: currentSkills,
    skillCount: currentSkills.length
  };
  return team;
}

function getTeamNames() {
  return teams.map((team) => team.name);
}

async function createTeam(teamName) {
  const collection = await Mongo.getConnection();
  if (getTeamNames().includes(teamName)) {
    const team = {_id: teamName, skills: []};
    return collection.insertOne(team);
  } else {
    return Promise.reject(Error('Team not found!'));
  }
}

async function teamSkills(teamName) {
  const collection = await Mongo.getConnection();
  const doc = await collection.findOne({ _id: teamName });
  if (doc) {
    return Promise.resolve(doc.skills);
  } else {
    await createTeam(teamName);
    return teamSkills(teamName);
  }
}

async function addToSkillSet(teamName, cardName) {
  const collection = await Mongo.getConnection();
  const doc = await collection.findOne({_id: teamName, skills: {$elemMatch: {name: cardName}}});
  if (doc) {
    return Promise.reject(Error('skill is already enabled'));
  }
  return collection.updateOne({_id: teamName}, {$push: {skills: {name: cardName, since: new Date()}}});
}

async function removeFromSkillSet(teamName, cardName) {
  const collection = await Mongo.getConnection();
  return collection.updateOne({_id: teamName}, {$pull: {skills: {name: cardName}}});
}

function toggleSkill(teamName, cardName) {
  return skills.getFlatFileNames().then((res) => {
    if (res.includes(cardName))
      return Promise.resolve(teamName);
    else
      return Promise.reject(Error(cardName + ' Skill not valid!'));
  }).then(teamSkills).then((res) => {
    if (res.find((skill) => skill.name == cardName))
      return removeFromSkillSet(teamName, cardName);
    else
      return addToSkillSet(teamName, cardName);
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
  const badgePath = `${__dirname}/../../config/badges`;
  return new Promise((resolve, reject) => {
    glob(`${badgePath}/**/*.yaml`, (err, files) => {
      if(err) {
        return reject(err);
      }
      return resolve(files.map(f => {
        return yaml.safeLoad(fs.readFileSync(f, 'utf-8'));
      }));
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
