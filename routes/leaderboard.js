'use strict';

const express = require('express');
const state = require('../lib/state');

const router = express.Router();

router.get('/', function (req, res) {
  state.getTeams().then((teams) => {
    teams.sort((a, b) => {
      return b.skillCount - a.skillCount;
    });
    res.render('leaderboard', 
      {'title': 'Leaderboard',
        'teams': teams});
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error getting teams!');
  });
});

exports.router = router;
