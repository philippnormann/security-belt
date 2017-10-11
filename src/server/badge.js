function teamHasBadge(team, badge) {
  let hasBadge = true;
  badge.requiredSkills.forEach((rs) => {
    if(hasBadge === false) {
      return;
    }
    const skill = team.skills.find(s => { return (s.id === rs) || (s.name === rs); });
    if(!skill) {
      hasBadge = false;
    }
  });

  return hasBadge;
}

exports.teamHasBadge = teamHasBadge;
