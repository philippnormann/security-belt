const state = require('./state');
const badge = require('./badge');

function slug(s) {
  let slg = s;
  slg = slg.toLowerCase();
  slg = slg.replace(/\s+/, '-');
  return slg;
}

/**
 * Assemble a team representation from different
 * sources. Prevents the need to have to do this
 * every time and gives a centralized representation.
 *
 * @param {*string} name The team name
 */
async function getTeamRepresentation(name) {
  const teamInfo = await state.getTeam(name);
  const allBadges = await state.getBadges();
  const teamBadges = allBadges.map(b => {
    return Object.assign({}, b, {
      isComplete: badge.teamHasBadge(teamInfo, b),
      id: slug(b.title),
      requiredSkills: b.requiredSkills.map(rs => {
        return { id: rs };
      })
    });
  });
  const skillsWithId = teamInfo.skills.map(skill => {
    const id = slug(skill.fileName);
    delete skill['fileName'];
    return Object.assign({}, skill, { id });
  });

  return {
    id: slug(teamInfo.name),
    name: teamInfo.name,
    securityChampion: teamInfo.champion,
    belt: teamInfo.belt,
    skills: skillsWithId,
    skillCount: teamInfo.skillCount,
    badges: teamBadges
  };
}

exports.getTeamRepresentation = getTeamRepresentation;
