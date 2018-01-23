/* eslint-env browser */
'use strict';

const selectors = {
  badgeSelect: '.badge-select',
  skillCard: '.skill-list__item',
  rankTabs: '.rank-select',
  rankTab: '.rank-select__tab',
  teamInfo: '.team-info'
};

function displayCards(predicate) {
  document.querySelectorAll(selectors.skillCard).forEach(function(card) {
    if(predicate === 'all') { // FIXME: dirty hack, is this even necessary?
      card.style.display = 'block';
      return;
    }
    if(predicate(card.dataset)) {
      card.style.display = 'block';
    } else  {
      card.style.display = 'none';
    }
  });
}

function initTabbing() {
  document.querySelectorAll(selectors.rankTab).forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      displayCards(cardData => cardData.skillRank === e.target.dataset.rank);
      const oldActive = document.querySelector('.rank-select__tab.mdc-tab--active');
      if(oldActive) {
        oldActive.classList.toggle('mdc-tab--active');
      }
      tab.classList.toggle('mdc-tab--active');
    });
  });

  document.querySelectorAll(selectors.badgeSelect).forEach(function(tab) {
    tab.addEventListener('click', function(e) {
      let elem = e.target;
      while (elem && !elem.dataset.badge) {
        elem = elem.parentNode;
      }
      displayCards(cardData => cardData.skillBadges.split(',').includes(elem.dataset.badge));
    });
  });
  const activeRank = document.querySelector(selectors.rankTabs).dataset.activeRank;
  displayCards(cardData => cardData.skillRank === activeRank);
  window.location.hash = activeRank;
}

if(document.querySelector(selectors.teamInfo)) {
  initTabbing();
}

