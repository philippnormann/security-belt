/* eslint-env mocha */
'use strict';
const sinon = require('sinon');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const state = require('../server/state');
const db = require('../server/db');
let collectionStub;

before(async () => {
  collectionStub = {
    findOne: sinon.stub().resolves({skills: []}),
    updateOne: sinon.stub().resolves(),
    insertOne: sinon.stub().resolves()
  };
  const dbStub = {
    collection: sinon.stub().returns(collectionStub)
  };
  sinon.stub(MongoClient, 'connect').resolves(dbStub);
  await db.getConnection();
});

describe('State', () => {

  describe('teamSkills()', () => {

    it('should return an empty array if team has no skills', () => {
      collectionStub.findOne.resolves({
        skills: []
      });
      return state.teamSkills('Team Awesome').then((skills) => {
        if (skills.length == 0)
          return Promise.resolve();
        else
          return Promise.reject();
      });
    });

    it('should return an array of team skills', async () => {
      const clock = sinon.useFakeTimers();
      const expectedSkills =  [{name: 'secure_sauce', since: new Date()}];
      collectionStub.findOne.resolves({skills: [{name: 'secure_sauce', since: new Date()}]});
      const teamSkills = await state.teamSkills('Team Awesome');
      clock.restore();
      assert.deepEqual(teamSkills, expectedSkills);
    });
  });

});

describe('addToSkillSet()', () => {

  it('should add skill with a current timestamp', () => {
    const clock = sinon.useFakeTimers();
    const expectedArgs = [{_id : 'Team Awesome'},
      {$push : {skills: {name: 'secure_sauce', since: new Date()}}}];
    collectionStub.findOne.resolves(undefined);
    return state.addToSkillSet('Team Awesome', 'secure_sauce').then(() => {
      clock.restore();
      if (collectionStub.updateOne.withArgs(expectedArgs[0],expectedArgs[1]).calledOnce)
        return Promise.resolve();
      else {
        const err = Error();
        err.expected = expectedArgs;
        err.actual = collectionStub.updateOne.getCall(collectionStub.updateOne.callCount - 1).args;
        return Promise.reject(err);
      }
    });
  });

  it('should reject if skill already added', () => {
    return new Promise((resolve,reject) => {
      collectionStub.findOne.resolves({skills: [{name: 'secure_sauce', since: new Date()}]});
      state.addToSkillSet('Team Awesome', 'secure_sauce').then(() => {
        reject(Error('expected reject but was resolved'));
      }).catch(() => {
        resolve();
      });
    });
  });

});

describe('removeFromSkillSet()', () => {

  it('should remove skill from set', () => {
    const expectedArgs = [{_id: 'Team Awesome'},
      {$pull: {skills: {name: 'secure_sauce'}}}];
    return state.removeFromSkillSet('Team Awesome', 'secure_sauce').then(() => {
      if (collectionStub.updateOne.withArgs(expectedArgs[0],expectedArgs[1]).calledOnce)
        return Promise.resolve();
      else {
        const err = Error();
        err.expected = expectedArgs;
        err.actual = collectionStub.updateOne.getCall(collectionStub.updateOne.callCount - 1).args;
        return Promise.reject(err);
      }
    });
  });

});

describe('belt()', () => {

  it('should return yellow if all yellow cards are completed', () => {
    const fileNames = {
      yellow: ['Test1','Test2'],
      orange: ['Test3'],
      black: ['Test4']
    };
    const skills = [{name: 'Test1'},{name: 'Test2'}];
    assert.equal(state.belt(skills,fileNames), 'yellow');
  });

  it('should not return black if orange cards are missing', () => {
    const fileNames = {
      yellow: ['Test1'],
      orange: ['Test2'],
      black: ['Test3','Test4']
    };
    const skills = [{name: 'Test1'},{name: 'Test3'},{name: 'Test4'}];
    assert.equal(state.belt(skills,fileNames), 'yellow');
  });

});


