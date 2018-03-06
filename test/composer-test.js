const sinon = require('sinon');
const assert = require('assert');
const composer = require('../server/composer');
const state = require('../server/state');
const skills = require('../server/skills');

describe('Composer', () => {
  describe('getTeamRepresentation()', () => {
    it('should return the right team', async () => {
      sinon.stub(state, 'getTeam').returns({
        name: 'Team 1',
        belt: 'white',
        skillCount: 1,
        skills: [
          { name: 'my-skill' }
        ]
      });
      sinon.stub(skills, 'get').resolves({
        yellow: [
          { name: 'my-skill', fileName: 'my-skill', title: 'My skill' }
        ]
      });
      sinon.stub(state, 'getBadges').returns([
        { id: 'my-badge', title: 'My badge', requiredSkills: ['my-skill'] }
      ]);
      const teamname = 'Team 1';
      const result = await composer.getTeamRepresentation(teamname);
      assert.equal(result.id, 'team-1');
      assert.equal(result.name, teamname);
      assert.equal(result.belt, 'white');
      assert.equal(result.skillCount, 1);
      assert.deepEqual(result.skills, [
        { title: 'My skill', id: 'my-skill', name: 'my-skill', rank: 'yellow', state: 'closed', links: [], badges: ['my-badge'] }
      ]);
      assert.deepEqual(result.badges, [
        {
          id: 'my-badge',
          isComplete: true,
          title: 'My badge',
          requiredSkills: [
            { id: 'my-skill' }
          ]
        }
      ]);
    });
  });
});
