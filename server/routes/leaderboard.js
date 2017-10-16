'use strict';

const express = require('express');
const state = require('../state');
const badge = require('../badge');

const router = express.Router();

router.get('/', function (req, res) {
  state.getTeams().then(async (teams) => {
    teams.sort((a, b) => {
      return b.skillCount - a.skillCount;
    });
    const allBadges = await state.getBadges();
    const teamsWithBadges = teams.map(t => {
      const withBadges = Object.assign({}, t);
      withBadges.badges = {
        completed: allBadges.filter(b => badge.teamHasBadge(t, b)).length,
        total: allBadges.length
      };
      return withBadges;
    });
    res.render('leaderboard', {
      title: 'Leaderboard',
      teams: teamsWithBadges
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error getting teams!');
  });
});

exports.router = router;
