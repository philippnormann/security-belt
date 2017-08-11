'use strict';
const express = require('express');
const router = express.Router();
const state = require('../lib/state');
const skills = require('../lib/skills');

skills.getFileNames().then((fileNames) => {
  router.post('/toggle', function (req, res) {
    state.toggleSkill(req.body.team, req.body.skill).then(() => {
      return state.teamSkills(req.body.team);
    }).then((teamSkills) => {
      res.status(200).send({
        'belt': state.belt(teamSkills, fileNames)
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
