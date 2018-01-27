/* eslint-env browser */
const selectors = {
  skillItem: '.skill-item',
  beltText: '.team-info__belt'
};

function capitalize(s){
  return s.toLowerCase()
    .replace( /\b./g, function(a){
      return a.toUpperCase();
    });
}

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

function toggleSkillState(id) {
  const skill = document.querySelector(`${selectors.skillItem}[data-skill-id="${id}"]`);
  if(skill) {
    if(skill.classList.contains('skill-item__open')) {
      skill.classList.remove('skill-item__open');
      skill.classList.add('skill-item__closed');
    } else {
      skill.classList.remove('skill-item__closed');
      skill.classList.add('skill-item__open');
    }
  }
}

export function initSkillActions() {
  const skills = document.querySelectorAll(selectors.skillItem);
  skills.forEach(function(skill) {
    skill.addEventListener('click', function(e) {
      const card = e.target.closest(selectors.skillItem);
      const { skillId, teamName } = card.dataset;
      const skillTitle = skillId;

      toggleSkill(teamName, skillTitle)
        .then(async function(res) {
          const body = await res.json();
          if(res.status === 404) {
            return;
          }

          const beltText = document.querySelector(selectors.beltText);
          beltText.innerHTML = `${capitalize(body.belt)}`;

          const oldBeltColor = document.querySelector(selectors.beltText).className.split(' ')
            .find(function(c) {
              return /.*-belt-text/.test(c);
            });
          beltText.classList.remove(oldBeltColor);
          beltText.classList.add(`${body.belt}-belt-text`);

          card.dataset.skillState = card.dataset.skillState === 'open' ? 'closed' : 'open';
          toggleSkillState(skillTitle);
        })
        .catch(function(err) {
          console.error(`Failed to toggle skill ${skillTitle}:`, err);
        });
    });
  });
}
