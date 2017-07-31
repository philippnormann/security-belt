/* eslint-env browser */
'use strict';

function filterSkills() {
  const color = window.location.hash.slice(1);
  const beltSections = document.querySelectorAll('.card-grid');
  beltSections.forEach((beltSection) => {
    beltSection.style.display = beltSection.id ===`${color}-section` ? 'block' : 'none';
  });
}

window.addEventListener('hashchange', () => {
  filterSkills();
});