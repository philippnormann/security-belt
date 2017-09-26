const express = require('express');
const Router = express.Router();
const state = require('../lib/state');

Router.get('/', async (req, res) => {
  const badges = await state.getBadges();
  res.render('badges', {
    title: 'Badges',
    badges: badges
  });
});

exports.router = Router;
