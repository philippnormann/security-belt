/* eslint-env browser */

import '../scss/style.scss';

import mdcAutoInit from '@material/auto-init';
import {MDCRipple} from '@material/ripple';
import {MDCTabBar, MDCTabBarScroller} from '@material/tabs';

mdcAutoInit.register('MDCTabBarScroller', MDCTabBarScroller);
mdcAutoInit.register('MDCTabBar', MDCTabBar);
mdcAutoInit.register('MDCRipple', MDCRipple);
mdcAutoInit();

const beltNames = {white: 'White', yellow: 'Yellow', orange: 'Orange', green: 'Green', blue: 'Blue', brown: 'Brown', black: 'Black'};

function filterSkills(color) {
  Object.keys(beltNames).forEach((sectionColor) => {
    const beltSection = document.querySelector(`#${sectionColor}-section`);
    if (beltSection)
      beltSection.style.display = `#${sectionColor}` === color ? 'block' : 'none';
  });
}

window.addEventListener('load', () => {
  const activeBelt = document.querySelector('.belt-toolbar .mdc-tab--active');
  window.location.hash = activeBelt.hash;
  filterSkills(window.location.hash);
});

window.addEventListener('hashchange', () => {
  filterSkills(window.location.hash);
});

function toggleSkill(team, skill) {
  return fetch('/skill/toggle', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({team, skill})
  });
}

const allMdcActions = document.querySelectorAll('a.mdc-card__action');
allMdcActions.forEach((MdcAction) => {
  MdcAction.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});
// Card click event hanlder
const allSkillCards = document.querySelectorAll('div.skill-card');
allSkillCards.forEach((skillCard) => {
  skillCard.addEventListener('click', (event) => {
    const card = event.currentTarget;
    const team = card.getAttribute('data-team');
    const skill = card.getAttribute('data-skill');
    toggleSkill(team, skill).then((response) => {
      response.json().then((data) => {
        const beltColor = document.querySelector('#belt-color');
        beltColor.className = `${data.belt}-belt-text`;
        beltColor.innerHTML = beltNames[data.belt];
      });
      card.classList.toggle('todo');
      card.classList.toggle('done');
    });
  });
});
