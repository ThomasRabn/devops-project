const { expect } = require('chai')
const userController = require('../src/controllers/user');
const client = require('../src/dbClient');

/******** CRUD USER TESTS ********/
describe('User', () => {

  beforeEach(function () {
    client.flushdb()
  });

  /************* CREATE *************/
  /********** CREATE USERS **********/
  describe('Create', () => {
    // Creating a user
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
    // Passing wrong parameters when creating a user
    it('passing wrong user parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      userController.create(user, (err, result) => {
        expect(String(err)).to.be.equal("Error: Wrong user parameters")
        expect(result).to.be.equal(null)
        done()
      })
    })
    // Try to create a user that is already in the database
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

  /************* READ *************/
  /********** FIND USERS **********/
  describe('Read', ()=> {
    // Get a user that is in the db
    it('get a user by username', (done) => {
      // 1. First, create a user to make this unit test independent from the others
      // 2. Then, check if the result of the get method is correct
      const user = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabian'
      }
      // We create the user
      userController.create(user, (err, res) => {
        // We get their infos
        userController.get("thomasrabn", (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.deep.equal(user)
          done()
        })
      })
    })
    // Get a user that is not in the db
    it('get a user that does not exist', (done) => {
      // We get the info of a unknown user
      userController.get("salut", (err, result) => {
        expect(String(err)).to.be.equal("Error: User does not exist")
        expect(result).to.be.equal(null)
        done()
      })
    })
    // Get all the users with 1 user in the db
    it('get all users', (done) => {
      // 1. First, create a user to make this unit test independent from the others
      // 2. Then, check if the result of the getAll method is correct
      const user = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabian'
      }
      // We create the user
      userController.create(user, (err, res) => {
        // We get their info
        userController.getAll( (err, result) => {
          expect(err).to.be.equal(null)
          expect(result).to.deep.equal([user.username])
          done()
        })
      })
    })
    // Get all the users when no one is in the db
    it('get all users with no one in database', (done) => {
      // We get the entirety of an empty database
      userController.getAll( (err, result) => {
        expect(err).to.be.equal(null)
        expect(result).to.deep.equal([])
        done()
      })
    })
  })

  /************* UPDATE *************/
  /********* MODIFY A USER **********/
  describe('Update', ()=> {
    // Update a user
    it('update a user', (done) => {
      // 1. First, create a user to make this unit test independent from the others
      // 2. Then, modify its first and last name
      // 3. Then, check if the result of the get method is correct
      const user = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabin'
      }
      const userModified = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabian'
      }
      // We create the user
      userController.create(user, (err, res) => {
        // We modify their info
        userController.modify(user.username, userModified, (err, res) => {
          userController.get("thomasrabn", (err2, result) => {
            expect(err).to.be.equal(null)
            expect(err2).to.be.equal(null)
            expect(result).to.deep.equal(userModified)
            done()
          })
        })
      })
    })
    // Update a user that does not exist
    it('update a user that does not exist', (done) => {
      // We modify a non existing user
      const userModified = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabian'
      }
      userController.modify(userModified.username, userModified, (err, res) => {
        expect(String(err)).to.be.equal("Error: User does not exist")
        expect(res).to.be.equal(null)
        done()
      })
    })
    // Update a user with wrong parameters
    it('update a user with wrong parameters', (done) => {
      // We modify a user with wrong parameters
      const user = {
        username: 'thomasrabn',
        firstname: 'Thomas',
      }
      userController.modify(user.username, user, (err, res) => {
        expect(String(err)).to.be.equal("Error: Wrong user parameters")
        expect(res).to.be.equal(null)
        done()
      })
    })
  })

  /************* DELETE *************/
  /********* DELETE A USER **********/
  describe('Delete', ()=> {
    // Delete a user
    it('delete a user', (done) => {
      // 1. First, create a user to make this unit test independent from the others
      // 2. Then, delete the user
      // 3. Then, check the result of the get
      const user = {
        username: 'thomasrabn',
        firstname: 'Thomas',
        lastname: 'Rabian'
      }
      // We create the user
      userController.create(user, (err, res) => {
        // We delete and get the user
        userController.delete(user.username, (err2, res2) => {
          userController.get(user.username, (err3, res3) => {
            expect(err && err2).to.be.equal(null)
            // Verify the delete
            expect(res2).to.deep.equal({status: 'deleted'})
            // Verify get
            expect(String(err3)).to.be.equal("Error: User does not exist")
            expect(res3).to.be.equal(null)
            done()
          })
        })
      })
    })
    // Delete a user that does not exist
    it('delete a user that does not exist', (done) => {
      // We delete a non existing user
      userController.delete("thomasrabn", (err, res) => {
        expect(String(err)).to.be.equal("Error: User could not be deleted")
        expect(res).to.be.equal(null)
        done()
      })
    })
  })

})
