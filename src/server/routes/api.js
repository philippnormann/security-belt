'use strict';

const express = require('express');
const state = require('../state');
const router = express.Router();

router.get('/stats', async (req, res) => {
  const days = req.query.days || 14;
  const progress = await state.getGraph(days);
  res.json({progress});
});

router.get('/stats/:teamName', async (req, res) => {
  const teamName = decodeURI(req.params.teamName);
  if (state.getTeamNames().includes(teamName)) {
    const days = req.query.days || 14;
    const progress = await state.getTeamGraph(teamName, days);
    res.json({progress});
  } else {
    res.status(404).json({error: `Team ${teamName} not found!`});
  }
});

router.get('/teams', async (req, res) => {
  try {
    const teams = await state.getTeams();
    res.json({teams});
  } catch (err) {
    console.error(err);
    res.status(500).json({error: 'Error getting teams'});
  }
});

router.get('/teams/:teamName', async (req, res) => {
  const teamName = decodeURI(req.params.teamName);
  if (state.getTeamNames().includes(teamName)) {
    try {
      const team = await state.getTeam(teamName);
      res.json(team);
    } catch (err) {
      console.error(err);
      res.status(500).json({error: `Error getting team ${teamName}`});
    }
  } else {
    res.status(404).json({error: `Team ${teamName} not found!`});
  }
});

exports.router = router;
