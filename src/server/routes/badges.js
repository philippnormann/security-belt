const express = require('express');
const Router = express.Router();
const state = require('../lib/state');
const skills = require('../lib/skills');

Router.get('/', async (req, res) => {
  const badges = await state.getBadges();
  const allSkillsByBelt = await skills.get();
  const allSkillsFlat = [];
  Object.keys(allSkillsByBelt).forEach((color) => {
    allSkillsFlat.push(...allSkillsByBelt[color]);
  })
  const badgesWithSkillInfos = [];
  badges.forEach((badge) => {
    const requiredSkills = badge.requiredSkills.map((id) => {
      return allSkillsFlat.find(s => s.fileName === id);
    });
    const badgeWithInfos = Object.assign({}, badge, { requiredSkills: requiredSkills });
    badgesWithSkillInfos.push(badgeWithInfos);
  });
  res.render('badges', {
    title: 'Badges',
    badges: badgesWithSkillInfos
  });
});

exports.router = Router;
