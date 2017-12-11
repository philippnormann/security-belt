const sinon = require('sinon');
const assert = require('assert');
const composer = require('../server/composer');
const state = require('../server/state');
const skills = require('../server/skills');

describe('Composer', () => {
  describe('getTeamRepresentation', () => {
    it('should return the right team', async () => {
      const teamKey = 'Team 1 Key';
      const teamname = 'Team 1';

      sinon.stub(state, 'getTeam').returns({
        key: teamKey,
        name: teamname,
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

      const result = await composer.getTeamRepresentation(teamname);
      assert.equal(result.id, 'team-1-key');
      assert.equal(result.name, teamname);
      assert.equal(result.belt, 'white');
      assert.equal(result.skillCount, 1);
      assert.deepEqual(result.skills, [
        { title: 'My skill', id: 'my-skill', name: 'my-skill', rank: 'yellow', state: 'closed', links: [] }
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
