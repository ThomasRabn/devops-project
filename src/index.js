const express = require('express')
const userRouter = require('./routes/user')
const bodyParser = require('body-parser')

const app = express()
const path = require('path');
const port = process.env.PORT || 3000

const client = require('./dbClient')
client.on("error", (err) => {
  console.error(err)
})

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname + '/views/index.html'))
})

app.get('/setname',function(req,res){
  res.sendFile(path.join(__dirname + '/views/setName.html'))
})

app.get('/getuser',function(req,res){
  res.sendFile(path.join(__dirname + '/views/getuser.html'))
})

app.get('/modifyuser',function(req,res){
  res.sendFile(path.join(__dirname + '/views/modifyuser.html'))
})

app.use('/user', userRouter)

const server = app.listen(port, (err) => {
  if (err) throw err
  console.log("Server listening the port " + port)
})

process.on('SIGINT', function() {
  console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" )
  process.exit(1)
})

module.exports = server
