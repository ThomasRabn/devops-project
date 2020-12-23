const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      return resp.status(201).json(respObj)
    })
  })
  .get('/', (req, resp) => {
    userController.getAll((err, res) => {
      let respObj
      if (err) {
        respObj = {
          users: null,
          err: err.message
        }
        return resp.status(400).json(respObj)
      }
      else {
        respObj = {
          users: res,
          err: null
        }
        resp.status(200).json(respObj)
      }
    })
  })
  .get('/:username', (req, resp) => { // Express URL params - https://expressjs.com/en/guide/routing.html
    const username = req.params.username
    userController.get(username, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          user: null,
          err: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        user: res,
        err: null
      }
      resp.status(200).json(respObj)
    })
  })
  .post('/:username', (req, resp) => {
    const username = req.params.username
    userController.modify(username, req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      return resp.status(200).json(respObj)
    })
  })
  .delete('/:username', (req, resp) => {
    const username = req.params.username
    userController.delete(username, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "deleted",
        error: null
      }
      return resp.status(200).json(respObj)
    })
  })

module.exports = userRouter
