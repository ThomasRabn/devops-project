const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

let client

describe('User REST API', () => {

  before(() => {
    client = require('../src/dbClient')
  })
  
  after(()=> {
    app.close()
    client.quit()
  })

  beforeEach(function () {
    client.flushdb()
  });

  /***** CREATE A USER *****/
  describe('POST /user', () => {

    it('create a new user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(201)
          chai.expect(res.body.status).to.equal('success')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
          throw err
        })
    })
    
    it('pass wrong parameters', (done) => {
      const user = {
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.equal('error')
          chai.expect(res).to.be.json
          done()
        })
        .catch((err) => {
          throw err
        })
    })

  })

  /***** READ A USER *****/
  describe('GET /user', () => {

    it('get an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.request(app)
            .get('/user/sergkudinov')
            .then((res) => {
              chai.expect(res).to.have.status(200)
              chai.expect(res.body.user).to.deep.equal(user)
              chai.expect(res.body.err).to.be.equal(null)
              done()
            })
        })
        .catch((err) => {
          throw err
        })
    })

    it('get a non-existing user', (done) => {
      chai.request(app)
        .get('/user/sergkudinov')
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.user).to.be.equal(null)
          chai.expect(res.body.err).to.be.equal('User does not exist')
          done()
        })
        .catch((err) => {
          throw err
        })
    })

    it('get all the users', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.request(app)
            .get('/user')
            .then((res) => {
              chai.expect(res).to.have.status(200)
              chai.expect(res.body.users).to.deep.equal([user.username])
              chai.expect(res.body.err).to.be.equal(null)
              done()
            })
        })
        .catch((err) => {
          throw err
        })
    })

    it('get all the users with no one in database', (done) => {
      chai.request(app)
        .get('/user')
        .then((res) => {
          chai.expect(res).to.have.status(200)
          chai.expect(res.body.users).to.deep.equal([])
          chai.expect(res.body.err).to.be.equal(null)
          done()
        })
      .catch((err) => {
        throw err
      })
    })

  })

  /***** UPDATE A USER *****/
  describe('PUT /user', () => {

    it('modify a user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergggeir',
        lastname: 'Kudiiiiinov'
      }
      const userModified = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.request(app)
            .put('/user/sergkudinov')
            .send(userModified)
            .then((res) => {
              chai.request(app)
                .get('/user/sergkudinov')
                .then((res) => {
                  chai.expect(res).to.have.status(200)
                  chai.expect(res.body.user).to.deep.equal(userModified)
                  chai.expect(res.body.err).to.be.equal(null)
                  done()
                })
            })
        })
        .catch((err) => {
          throw err
        })
    })

    it('modify a non-existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .put('/user/sergkudinov')
        .send(user)
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.be.equal('error')
          chai.expect(res.body.msg).to.be.equal('User does not exist')
          done()
        })
        .catch((err) => {
          throw err
        })
    })

  })

  /***** DELETE A USER *****/
  describe('DELETE /user', () => {

    it('delete an existing user', (done) => {
      const user = {
        username: 'sergkudinov',
        firstname: 'Sergei',
        lastname: 'Kudinov'
      }
      chai.request(app)
        .post('/user')
        .send(user)
        .then((res) => {
          chai.request(app)
            .delete('/user/sergkudinov')
            .then((res) => {
              chai.expect(res).to.have.status(200)
              chai.expect(res.body.status).to.deep.equal('deleted')
              chai.expect(res.body.error).to.be.equal(null)
              done()
            })
        })
        .catch((err) => {
          throw err
        })
    })

    it('delete a non-existing user', (done) => {
      chai.request(app)
        .delete('/user/sergkudinov')
        .then((res) => {
          chai.expect(res).to.have.status(400)
          chai.expect(res.body.status).to.deep.equal('error')
          chai.expect(res.body.error).to.not.be.equal('User could not be deleted')
          done()
        })
      .catch((err) => {
        throw err
      })
    })

  })

})
