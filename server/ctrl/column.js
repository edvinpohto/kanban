const nanoid = require('nanoid')
const db = require('../utils/db')
module.exports = {
  //add column
  add: ({ body, params }) => {
    const code = params.code.toUpperCase()
    const title = body.title
    const columnPosition = body.columnPosition
    const cards = []
    const column = {
      title,
      cards,
    }
    const data = db.get()
    const boardColumns = data[code].columns
    // check inserted position
    if (columnPosition == boardColumns.length) {
      boardColumns.push(column)
    } else {
      boardColumns.splice(columnPosition, 0, column)
    }
    db.set(data)
    return true
  },
  // delete a column
  del: ({ params, body }) => {
    const code = params.code.toUpperCase()
    const { columnIndex } = body
    const data = db.get()
    data[code].columns.splice(columnIndex, 1)
    db.set(data)
    return true
  },
  // to check if a column exists
  isColumnExist: ({ params, body }) => {
    const data = db.get()
    if (data[params.code.toUpperCase()]) {
      const found = data[params.code.toUpperCase()].columns.find(column => column.title == body.title)
      return !!found
    } else {
      return true
    }
  },
}
