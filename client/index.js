let boards = {
  CS5003:
    {
      title: 'Board 1 - CS5003',
      columns: [
        {
          title: 'Waiting',
          cards: [
            {
              title: 'cardTitle',
              desc: 'desc',
              subTasks: [
                { title: 'subTaskTitle', checked: false, disabled: false },
                { title: 'subTaskTitle2', checked: false, disabled: false },
              ],
            },
            {
              title: 'cardTitle2',
              desc: 'desc',
              subTasks: [
                { title: 'subTaskTitle', checked: false, disabled: false },
                { title: 'subTaskTitle2', checked: false, disabled: false },
              ],
            },
          ],
        },
        {
          title: 'In-progress', cards: [
            {
              title: 'cardTitle3',
              desc: 'desc',
              subTasks: [
                { title: 'subTaskTitle', checked: false, disabled: false },
                { title: 'subTaskTitle2', checked: false, disabled: false },
              ],
            },
          ],
        },
        { title: 'Completed', cards: [] },

      ],
    },
  CS5004:
    {
      title: 'Board 1 - CS5004',
      column1: 'Waiting',
      column2: 'In-progress',
      column3: 'Completed',
      cards: [
        { title: 'Card 1' },
        { title: 'Card 2' },
      ],
    },
}

let kanban = new Vue({
  el: '#app',
  data: {
    cardTitle: '',
    cardDesc: '',
    subTaskTitle: '',
    subTasks: [],
    columnPosition: 0,
    columnName: '',
    secretKey: '',
    boardCode: '',
    boardTitle: '',
    defaultColumns: true,
    loadedBoard: {},
  },

  methods: {
    refreshPage() {
      location.reload()
    },
    //Add New Board
    async addNewBoard() {
      if (!this.boardTitle) {
        window.alert('Please input board title')
        return
      }
      const data = {
        code: this.boardCode,
        title: this.boardTitle,
        secretKey: this.secretKey,
        defaultColumns: this.defaultColumns,
      }
      //Sending request to the fetch.js file. From there it is sent to the back end. 
      const res = await postData(`/board/${data.code}`, data)
      if (res.code == 200) {
        window.alert('secret key: ' + res.data)
        //Request to load board after a response is received.
        this.handleLoadBoard()
      } else {
        // if the response is not successful, alerts the alternative response message
        window.alert(res.msg)
      }
    },
    // Handler for loading board. Gets used each time data needs to be updated on the screen.
    async handleLoadBoard() {
      if (!this.boardCode) {
        window.alert('Please input board code')
        return
      }
      //read secret key
      const secretKey = window.prompt('Please input secret key to the board:', '')
      this.secretKey = secretKey
      //request board
      await this.getBoard()
    },
    async getBoard() {
      const data = {
        code: this.loadedBoard.code || this.boardCode,
        secretKey: this.secretKey,
      }
      //server request via the fetch.js file
      const res = await getData(`/board/${data.code}`, data)
      if (res.code == 200) {
        //get loaded board if the response is solved
        this.loadedBoard = res.data
      } else {
        window.alert(res.msg)
      }
    },
    //Add card
    async handleAddCard() {
      if (!this.cardTitle) {
        window.alert('Please input card title')
        return
      }
      if (!this.cardDesc) {
        window.alert('Please input card description')
        return
      }
      if (!this.subTasks.length) {
        window.alert('Please input subTasks')
        return
      }

      let code = this.boardCode
      let cardTitle = this.cardTitle
      let cardDescription = this.cardDesc
      let data = {
        title: cardTitle,
        desc: cardDescription,
        //set state for each subtask
        subTasks: this.subTasks.map(subTask => ({ title: subTask, disabled: false })),
        code,
      }
      const res = await postData('/card/' + code, data)
      if (res.code === 200) {
        this.getBoard()
        this.cardTitle = ''
        this.cardDesc = ''
        this.subTasks = []
      } else {
        window.alert(res.msg)
      }
    },
    //remove card
    async handleMove(columnIndex, cardIndex, card) {
      let code = this.boardCode
      let data = { columnIndex: columnIndex, cardIndex: cardIndex, card }
      await postData('/card/move/' + code, data)
      this.getBoard()
    },
    //delete card
    async handleDelete(columnIndex, cardIndex) {
      let code = this.boardCode
      let data = { columnIndex: columnIndex, cardIndex: cardIndex }
      // All deletions have a verification run by the user
      let verification = prompt("Are you sure you want to delete this card? Y/N").toUpperCase()
      if (verification === "Y") {
        await postData('/card/del/' + code, data)
        this.getBoard()
      }
    },
    //create sub task
    createSubtask() {
      if (this.subTaskTitle) {
        this.subTasks.push(this.subTaskTitle)
        this.subTaskTitle = ''
      }
    },
    //save cards
    async handleSave(columnIndex, cardIndex, card) {
      let code = this.boardCode
      let data = { columnIndex: columnIndex, cardIndex: cardIndex, card }
      await postData('/card/save/' + code, data)
      this.getBoard()
    },
    //add columns
    async addColumn() {
      if (!this.columnName) {
        window.alert('Please input column name')
        return
      }
      const data = {
        code: this.loadedBoard.code,
        title: this.columnName,
        columnPosition: this.columnPosition,
      }
      const res = await postData(`/column/${data.code}`, data)
      if (res.code == 200) {
        this.getBoard()
        this.columnName = ''
      } else {
        window.alert(res.msg)
      }
    },
    //delete column
    async deleteColumn(columnIndex) {
      let code = this.boardCode
      let data = { columnIndex: columnIndex }
      let verification = prompt("Are you sure you want to delete this column? Y/N").toUpperCase()
      if (verification === "Y") {
        await postData('/column/del/' + code, data)
        this.getBoard()
      }
    },
  },
})
