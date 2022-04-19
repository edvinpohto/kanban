const nanoid = require('nanoid')
const db = require('../utils/db')
//defining default columns
const defaultColumns = [
  {
    title: 'Waiting',
    cards: [],
  },
  {
    title: 'In-progress',
    cards: [],
  },
  {
    title: 'Completed',
    cards: [],
  },
]
module.exports = {
  // add board
  add: ({ body, params }) => {
    const code = params.code.toUpperCase()
    const title = body.title
    //check default column
    const columns = body.defaultColumns ? defaultColumns : []

    //produce random secret key
    const secretKey = nanoid.nanoid(10)
    const board = {
      title,
      secretKey,
      columns,
    }
    //save data to database
    const data = db.get()
    db.set({ ...data, [code]: board })
    return secretKey
  },
  //check if board exist
  isBoardExist: ({ params }) => {
    const data = db.get()
    return !!data[params.code.toUpperCase()]
  },
  //get code and secretKey through board
  getByCode: ({ params, query }) => {
    const code = params.code.toUpperCase()
    const secretKey = query.secretKey
    const data = db.get()
    if (data[code].secretKey !== secretKey) {
      return false
    } else {
      return { ...data[code], code }
    }
  },
}
