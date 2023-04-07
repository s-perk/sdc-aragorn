const fs = require('fs');
const readline = require('readline');
const { once } = require('node:events');
const Promise = require('bluebird')
const client = require('../connection.js').client

let query = ``
let count = 0

/* Inputs:
    filePath: CSV file to load from
    callback: function to call on each line of CSV
    limit: total number of lines to evaluate
    chunk: number of lines to evaluate before adding to database
*/
const loadRecords = (filePath, translateFunc, limit, chunk, start) => {
  filePath = filePath || '../extracts/questions.csv'
  translateFunc = translateFunc || require('./queryUtilities.js').translateQuestion
  limit = limit || 1000
  chunk = chunk || 100
  start = start || 0

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });





  // Function to periodically run query to database, so we're not creating a massive query string
  const saveChunk = (query, count) => {
    client.query(query, (err, res) => {
      if (!err) {
        console.log(`${count} rows loaded into database`)
      } else {
        console.log('err', err.message)
      }
      // client.end()
    })
  }


  // Main function to process each line of code
  async function processLineByLine() {

    for await (const line of rl) {
      // Skip header line and any lines before start
      if ((count === 0) || (count < start)) {
        count++
        continue;
      }

      // testing limit
      if (count > limit) {break;}

      query += translateFunc(line)

      // Save to database every few thousand
      if (count % chunk === 0) {

        saveChunk(query, count)
        query = ''
      }

      count++
    }

    // await once(rl, 'close');

    console.log(`after process: total of ${count} rows loaded`)


  }


  // Process Data
  processLineByLine()
  // return new Promise (function (resolve, reject){
  //   processLineByLine()
  //   resolve()
  // })




}

module.exports.loadRecords = loadRecords
