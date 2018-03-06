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
    if(predicate(card.dataset)) {
      card.style.display = 'block';
    } else  {
      card.style.display = 'none';
    }
  });
}

export function initTabbing() {
  if(document.querySelector(selectors.teamInfo)) {
    document.querySelectorAll(selectors.rankTab).forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        displayCards(cardData => cardData.skillRank === e.target.dataset.rank);
        const oldActive = document.querySelector('.rank-select__tab.mdc-tab--active');
        if(oldActive) {
          oldActive.classList.toggle('mdc-tab--active');
        }
        tab.classList.toggle('mdc-tab--active');

        document.querySelector('.rank-select .tab-bar-indicator-marker').classList.add('mdc-tab-bar__indicator');
        document.querySelector('.badge-select .tab-bar-indicator-marker').classList.remove('mdc-tab-bar__indicator');
      });
    });

    document.querySelectorAll(selectors.badgeSelect).forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        let elem = e.target;
        while (elem && !elem.dataset.badge) {
          elem = elem.parentNode;
        }
        displayCards(cardData => cardData.skillBadges.split(',').includes(elem.dataset.badge));
        document.querySelector('.rank-select .tab-bar-indicator-marker').classList.remove('mdc-tab-bar__indicator');
        document.querySelector('.badge-select .tab-bar-indicator-marker').classList.add('mdc-tab-bar__indicator');
      });
    });

    const activeRank = document.querySelector(selectors.rankTabs).dataset.activeRank;
    displayCards(cardData => cardData.skillRank === activeRank);
    window.location.hash = activeRank;

    document.querySelector('.badge-select .tab-bar-indicator-marker').classList.remove('mdc-tab-bar__indicator');
  }
}


