'use strict';
const express = require('express');
const skills = require('../skills');
const state = require('../state');
const badge = require('../badge');

const router = express.Router();

skills.get().then((result) => {
  router.get('/:teamName', async (req, res) => {
    const teamName = decodeURI(req.params.teamName);
    if (state.getTeamNames().includes(teamName)) {
      try {
        const team = await state.getTeam(teamName);
        const allBadges = await state.getBadges();
        const teamBadges = allBadges.map(b => {
          const hasBadge = badge.teamHasBadge(team, b);
          return {
            badge: b,
            hasBadge: hasBadge
          };
        });
        res.render('team', {
          title: team.name,
          team: team,
          skills: result,
          badges: teamBadges
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
