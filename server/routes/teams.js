'use strict';
const express = require('express');
const skills = require('../skills');
const state = require('../state');
const composer = require('../composer');

const router = express.Router();

/* eslint-disable no-unused-vars */
skills.get().then((_) => {
  router.get('/:teamName', async (req, res) => {
    const teamName = decodeURI(req.params.teamName);
    if (state.getTeamNames().includes(teamName)) {
      try {
        const repr = await composer.getTeamRepresentation(teamName);
        res.render('team', {
          title: repr.name,
          team: repr
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
