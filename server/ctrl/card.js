const db = require('../utils/db')

module.exports = {
  //add cards
  add: ({ body, params }) => {
    const code = params.code.toUpperCase()
    const title = body.title
    const desc = body.desc
    const subTasks = body.subTasks
    const card = {
      title,
      desc,
      subTasks,
    }
    const data = db.get()
    const boardColumns = data[code].columns
    boardColumns[0].cards.push(card)
    db.set(data)
    return true
  },
  //check if card exist
  isCardExist: ({ params, body }) => {
    const data = db.get()
    if (data[params.code.toUpperCase()]) {
      const column = data[params.code.toUpperCase()].columns[0]
      //check if name correct
      const found = column.cards.find(card => card.title = params.title)
      if (found) {
        return true
      } else {
        return false
      }
    } else {
      return true
    }
  },
  //move the card
  move: ({ params, body }) => {
    const code = params.code.toUpperCase()
    const { columnIndex, cardIndex, card: currentCard } = body
    const data = db.get()
    //delete current card
    const card = data[code].columns[columnIndex].cards.splice(cardIndex, 1)
    //disable the checked subtask when moving
    card.subTasks = currentCard.subTasks.map(i => {
        i.checked && (i.disabled = true)
        return i
      },
    )
    //push the deleted card into the next column
    data[code].columns[columnIndex + 1].cards.push(card[0])
    db.set(data)
    return true
  },
  //delete card
  del: ({ params, body }) => {
    const code = params.code.toUpperCase()
    const { columnIndex, cardIndex } = body
    const data = db.get()
    //delete card
    data[code].columns[columnIndex].cards.splice(cardIndex, 1)
    db.set(data)
    return true
  },
  //save card
  save: ({ params, body }) => {
    const code = params.code.toUpperCase()
    const { columnIndex, cardIndex, card: currentCard } = body
    const data = db.get()
    const card = data[code].columns[columnIndex].cards[cardIndex]
    //disable the checked subtask before saving
    data[code].columns[columnIndex].cards[cardIndex].subTasks = currentCard.subTasks.map(i => {
        i.checked && (i.disabled = true)
        return i
      },
    )
    db.set(data)
    return true
  },
}
