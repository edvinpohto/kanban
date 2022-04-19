// This file essentially functions as the engine that sends and retrieves data to and from the database.
// The Node.js filesystem module (fs) allows for easy interaction with a filesystem.
// https://nodejs.dev/learn/the-nodejs-fs-module 
const fs = require('fs')
const path = require('path')
module.exports = {
  //gets data from data.json
  get: () => {
    const dataStr = fs.readFileSync(path.join(__dirname, '../db/data.json'), 'utf8')
    return JSON.parse(dataStr)
  },
  //writes data into data.json
  set: (json) => {
    const dataStr = JSON.stringify(json)
    fs.writeFileSync(path.join(__dirname, '../db/data.json'), dataStr, 'utf8')
  },
}
