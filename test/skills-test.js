/* eslint-env mocha */
'use strict';
const skills = require('../lib/skills');
const assert = require('assert');

describe('Skills', () => {

  describe('extractFileNames()', () => {

    it('should return a map of belts to card filenames', () => {
      const testBelts = {
        yellow: [{
          foo: 'bar',
          fileName: 'all_devices_encrypted'
        }]
      };
      const expected = {
        yellow: ['all_devices_encrypted']
      };
      assert.deepEqual(skills.extractFileNames(testBelts), expected);
    });

  });

  describe('read()', () => {

    it('should resolve and return object representing the contents of the correctly formatted .yml files', async() => {
      const testPath = __dirname + '/good-skills';
      const expected = {
        yellow: [{
          title: 'Strong passwords',
          why: 'Prevent bruteforce attacks against your accounts',
          how: 'Everyone in the team uses a password manage',
          validation: 'All passwords are generated randomly',
          links: [{
            'XKCD': 'https://www.explainxkcd.com/wiki/index.php/936:_Password_Strength'
          }, {
            'Password strength meter': 'https://howsecureismypassword.net/'
          }],
          fileName: 'strong_passwords'
        }],
        orange: [],
        green: [],
        blue: [{
          title: 'SSL everywhere',
          why: 'Don\'t send data over unencrypted channels',
          how: 'Use SSL for all services you offer and validate SSL certificates for all services you consume',
          validation: 'Use nmap to ensure only port 443 is open',
          fileName: 'tls_everywhere'
        }],
        brown: [],
        black: []
      };
      const res = await skills.read(testPath);
      assert.deepEqual(res, expected);
    });

    it('should reject with an error if .yml files contain syntax errors', () => {
      const testPath = __dirname + '/bad-skills';
      return new Promise((resolve, reject) => {
        skills.read(testPath).then(() => {
          reject(Error('should not resolve with incorrectly formatted .yml files'));
        }).catch(() => {
          resolve();
        });
      });
    });

  });

});
