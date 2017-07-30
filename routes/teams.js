'use strict';
const express = require('express');
const skills = require('../lib/skills');
const state = require('../lib/state');

const router = express.Router();

skills.get().then((result) => {
  router.get('/:teamName', async (req, res) => {
    const teamName = decodeURI(req.params.teamName);
    if (state.getTeamNames().includes(teamName)) {
      try {
        const team = await state.getTeam(teamName);
        res.render('team', {
          'title': team.name,
          'team': team,
          'skills': result,
        });
      } catch(err) {
        console.error(err);
        res.status(500).send('Error getting team status!');
      }
    } else {
      res.status(404).send('Team not found!');
    }
  });
}).catch((err) => {
  console.error(err);
});

router.get('/', (req, res) => {
  state.getTeams().then((teams) => {
    res.render('teams', {
      'title': 'Teams',
      'teams': teams
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send('Error getting teams!');
  });
});

exports.router = router;
