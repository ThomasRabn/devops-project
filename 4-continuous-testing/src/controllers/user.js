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
    // TODO create this method
    value = client.hgetall(username, (err, res) => {
      if(err || res == null) {
        return callback(Error("No such user"), null)
      } else {
        val = merge({username: username}, res)
        return callback(null, val)
      }
    })    
  }
}
