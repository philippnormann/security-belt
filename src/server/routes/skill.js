'use strict';
const express = require('express');
const router = express.Router();
const state = require('../state');
const skills = require('../skills');

skills.getFileNames().then((fileNames) => {
  router.post('/toggle', async function (req, res) {
    state.toggleSkill(req.body.team, req.body.skill).then(() => {
      return state.teamSkills(req.body.team);
    }).then((teamSkills) => {
      const belt = state.belt(teamSkills, fileNames);
      console.info(`New belt for ${req.body.team}: ${belt}`);
      res.status(200).send({
        belt: belt
      });
    }).catch((error) => {
      res.status(404).send({
        error: error.message
      });
    });
  });
}).catch((err) => {
  console.error(err);
});

exports.router = router;
