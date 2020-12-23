const client = require('../dbClient')
const {merge} = require('mixme')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Check if it already exists and save to DB
    client.hgetall(user.username, (error, userReturned) => {
      if(userReturned == null) {
        client.hmset(user.username, userObj, (err, res) => {
          if (err) return callback(err, null)
          callback(null, res) // Return callback
        })
      } else {
        return callback(Error("User already exists"), null)
      }
    })
  },
  get: (username, callback) => {
    value = client.hgetall(username, (err, res) => {
      if(err || res == null) {
        return callback(Error("User does not exist"), null)
      } else {
        val = merge({username: username}, res)
        return callback(null, val)
      }
    })
  },
  getAll: (callback) => {
    client.keys("*", (err,res) => {
      if(err || res == null ) {
        return callback(err, null)
      }  else {
        return callback(null, res)
      }
    })
  },
  modify: (username, user, callback) => {
    if(!username || !user.firstname || !user.lastname)
      return callback(Error("Wrong user parameters"), null)
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Check if it is in db
    client.hgetall(username, (error, userReturned) => {
      if(userReturned) {
        client.hmset(username, userObj, (err, res) => {
          if (err) return callback(err, null)
          callback(null, res) // Return updated user
        })
      } else {
        return callback(Error("User does not exist"), null)
      }
    })
  },
  delete: (username, callback) => {
    if(!username)
      return callback(Error("Wrong user parameters"), null)
    // Check if it is in db
    client.del(username, (err, res) => {
      if(res != 1 || err) {
        callback(Error("User could not be deleted"), null)
      } else {
        callback(null, {status: 'deleted'})
      }
    })
  }
}
