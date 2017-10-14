/* eslint-env browser */
'use strict';

const selectors = {
  skillCard: '.skill-list__item',
  rankTabs: '.rank-select',
  rankTab: '.rank-select__tab',
  teamInfo: '.team-info'
};

function displayCards(rank) {
  document.querySelectorAll(selectors.skillCard).forEach(function(card) {
    const { skillRank } = card.dataset;
    if(rank === 'all') {
      card.style.display = 'block';
      return;
    }
    if(skillRank !== rank) {
      card.style.display = 'none';
    } else  {
      card.style.display = 'block';
    }
  });
}

function initTabbing() {
  document.querySelectorAll(selectors.rankTab).forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      displayCards(e.target.dataset.rank);
      const oldActive = document.querySelector('.rank-select__tab.mdc-tab--active');
      if(oldActive) {
        oldActive.classList.toggle('mdc-tab--active');
      }
      tab.classList.toggle('mdc-tab--active');
    });
  });
  const activeRank = document.querySelector(selectors.rankTabs).dataset.activeRank;
  displayCards(activeRank);
  window.location.hash = activeRank;
}

if(document.querySelector(selectors.teamInfo)) {
  initTabbing();
}

