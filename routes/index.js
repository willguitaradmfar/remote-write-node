const express = require('express')
const router = express.Router()

const middleware = require('../middleware')

router.use(middleware) // Concat + Snappy + decode Proto

router.post('/', function (req, res, next) {
  console.log('*** Enviar isso para carol *** ==>>', req.body)
  res.json(req.body)
})

module.exports = router
