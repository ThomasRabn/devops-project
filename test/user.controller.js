const { expect } = require('chai')
const userController = require('../src/controllers/user');
const client = require('../src/dbClient');

describe('User', () => {

  beforeEach(function () {
    client.flushdb()
  });

  describe('Create', () => {

    it('create a new user', (done) => {

      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.be.equal('OK')
        done()
      })
    })

    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(err).to.not.be.equal(null)
        expect(result).to.be.equal(null)
        done()
      })
    })

    it('avoid creating an existing user', (done)=> {
      // Warning: the user already exists
      const user = {
        username: 'azerty',
        firstname: 'Pierre',
        lastname: 'Dupont'
      }
      userController.create(user, (err, result) => {
        userController.create(user, (err2, result2) => {
          expect(err).to.be.equal(null)
          expect(String(err2)).to.be.equal("Error: User already exists")
          expect(result2).to.be.equal(null)
          done()
        })
      })      
    })
  })

  describe('Get', ()=> {
    it('get a user by username', (done) => {
      // 1. First, create a user to make this unit test independent from the others
      // 2. Then, check if the result of the get method is correct
      const user = {
        username: 'qwerty',
        firstname: 'Mehdi',
        lastname: 'Jean'
      }
      // We create the user
      userController.create(user, (err, res) => {
        // We get his infos
        userController.get("qwerty", (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.deep.equal(user)
          done()
        })
      })
    })
  })
})
