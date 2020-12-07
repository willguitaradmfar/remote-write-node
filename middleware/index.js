const express = require('express')
const router = express.Router()
const path = require('path')

const concat = require('concat-stream')
const snappy = require('snappy')
const protobuf = require('protobufjs')

const concatMiddleware = (req, res, next) => {
  return req.pipe(concat(function (data) {
    req.body = data
    return next()
  }))
}

const snappyMiddleware = (req, res, next) => {
  return snappy.uncompress(req.body, { asBuffer: true }, function (err, original) {
    if (err) return next(err)

    req.body = original

    return next()
  })
}

const protoMiddleware = (req, res, next) => {
  return protobuf.load(path.resolve(__dirname, 'prometheus.proto'), function (err, root) {
    if (err) return next(err)
    const WriteRequest = root.lookupType('prometheus.WriteRequest')
    try {
      req.body = WriteRequest.decode(req.body)
      return next()
    } catch (err) {
      return next(err)
    }
  })
}

router.use(concatMiddleware)
router.use(snappyMiddleware)
router.use(protoMiddleware)

module.exports = router
