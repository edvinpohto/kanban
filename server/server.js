const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const API_PORT = 3000
const board = require('./ctrl/board')
const column = require('./ctrl/column')
const card = require('./ctrl/card')

// body parser aids in accessing data sent to the server
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//add board
app.post('/board/:code', (req, res, next) => {
  //check if board exists
  if (board.isBoardExist(req)) {
    res.send({ code: 500, msg: `Board ${req.params.code.toUpperCase()} already exist!` })
  } else {
    const secretKey = board.add(req)
    res.send({ code: 200, data: secretKey })

  }
})

// get board
app.get('/board/:code', (req, res, next) => {
  //check if board exists
  if (board.isBoardExist(req)) {
    const data = board.getByCode(req)
    if (data) {
      res.send({ code: 200, data })
    } else {
      res.send({ code: 500, msg: `invalid secret key!` })
    }
  } else {
    res.send({ code: 500, msg: `Board ${req.params.code.toUpperCase()} is not exist!` })
  }
})
//add card
app.post('/card/:code', (req, res, next) => {
  //check if card exists
  if (card.isCardExist(req)) {
    res.send({ code: 500, msg: `card ${req.body.title} already exist!` })
  } else {
    card.add(req)
    res.send({ code: 200 })
  }
})

//move card
app.post('/card/move/:code', (req, res, next) => {
  card.move(req)
  res.send({ code: 200 })
})
//delete card
app.post('/card/del/:code', (req, res, next) => {
  card.del(req)
  res.send({ code: 200 })
})
//save card
app.post('/card/save/:code', (req, res, next) => {
  card.save(req)
  res.send({ code: 200 })
})
//add column
app.post('/column/:code', (req, res, next) => {
  if (column.isColumnExist(req)) {
    res.send({ code: 500, msg: `column ${req.body.title} already exist!` })
  } else {
    column.add(req)
    res.send({ code: 200 })
  }
})
//delete column
app.post('/column/del/:code', (req, res, next) => {
    column.del(req)
    res.send({ code: 200 })
})

app.use(express.static('../client'))

app.listen(API_PORT, () => {
  console.log(`Listening on localhost:${API_PORT}`)
})

