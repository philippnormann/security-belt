/* eslint-env browser */
'use strict';

function filterSkills() {
  const color = window.location.hash.slice(1);
  const beltSections = document.querySelectorAll('.card-grid');
  beltSections.forEach((beltSection) => {
    beltSection.style.display = beltSection.id ===`${color}-section` ? 'block' : 'none';
  });
}

window.addEventListener('load', () => {
  const activeBelt = document.querySelector('.belt-toolbar .mdc-tab--active');
  if (activeBelt) {
    window.location.hash = activeBelt.hash;
    filterSkills();
  }
});

window.addEventListener('hashchange', () => {
  filterSkills();
});