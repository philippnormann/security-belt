/* eslint-env browser */
'use strict';

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

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const allMdcActions = document.querySelectorAll('a.mdc-card__action');

allMdcActions.forEach((MdcAction) => {
  MdcAction.addEventListener('click', (event) => {
    event.stopPropagation();
  });
});

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
        beltColor.innerHTML = capitalizeFirstLetter(data.belt);
      });
      card.classList.toggle('todo');
      card.classList.toggle('done');
    });
  });
});