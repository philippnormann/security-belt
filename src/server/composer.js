const state = require('./state');
const badge = require('./badge');
const skills = require('./skills');

function slug(s) {
  let slg = s;
  slg = slg.toLowerCase();
  slg = slg.replace(/\s+/, '-');
  return slg;
}

/**
 * Ungroup the legacy representation of skills. It looks like this:
 * { yellow: [...skills], green: [...skills] }
 * which is turned into this:
 * [ { <old-data>, rank: yellow }, { <old-data>, rank: green} ]
 * @param {*Object} skills The grouped skills object
 */
function ungroupSkills(skills) {
  let ungrouped = [];
  Object.keys(skills).forEach(color => {
    const byColor = skills[color].map(s => {
      return Object.assign({}, s, { rank: color });
    });
    ungrouped = ungrouped.concat(byColor);
  });
  return ungrouped;
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

  const allSkills = await skills.get();
  const flatSkills = ungroupSkills(allSkills);

  const allSkillsWithState = flatSkills.map(skill => {
    const withState = Object.assign({}, skill);
    withState.id = slug(withState.fileName);
    withState.state = teamInfo.skills.find(s => {
      const has = s.name === skill.fileName;
      return has;
    }) ? 'closed' : 'open';
    let links = [];
    if(withState.links) {
      withState.links.forEach(kvPairs => {
        const flattened = [];
        Object.keys(kvPairs).forEach(k => {
          flattened.push({
            title: k,
            url: kvPairs[k]
          });
        });
        links = links.concat(flattened);
      });
    }
    withState.links = links;
    delete withState['fileName'];
    return withState;
  });

  const composed = {
    id: slug(teamInfo.name),
    name: teamInfo.name,
    securityChampion: teamInfo.champion,
    belt: teamInfo.belt,
    skills: allSkillsWithState,
    skillCount: teamInfo.skillCount,
    badges: teamBadges
  };
  return composed;
}

exports.getTeamRepresentation = getTeamRepresentation;
