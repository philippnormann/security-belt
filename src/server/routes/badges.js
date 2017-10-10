const express = require('express');
const Router = express.Router();
const state = require('../state');
const skills = require('../skills');
const { teamHasBadge } = require('../badge');

Router.get('/', async (req, res) => {
  const badges = await state.getBadges();
  const teams = await state.getTeams();
  const allSkillsByBelt = await skills.get();
  const allSkillsFlat = [];
  Object.keys(allSkillsByBelt).forEach((color) => {
    allSkillsFlat.push(...allSkillsByBelt[color]);
  });
  const badgesWithSkillInfos = [];
  badges.forEach((badge) => {
    const requiredSkills = badge.requiredSkills.map((id) => {
      return allSkillsFlat.find(s => s.fileName === id);
    });
    const badgeWithInfos = Object.assign({}, badge, { requiredSkills: requiredSkills });
    badgeWithInfos.teams = teams.map((t) => {
      const hasAchievedBadge = teamHasBadge(t, badge);
      return {
        teamName: t.name,
        hasBadge: hasAchievedBadge
      };
    });
    badgesWithSkillInfos.push(badgeWithInfos);
  });
  res.render('badges', {
    title: 'Badges',
    badges: badgesWithSkillInfos
  });
});

exports.router = Router;
