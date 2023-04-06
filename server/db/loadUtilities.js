const fs = require('fs');
const readline = require('readline');
const Promise = require('bluebird')
const {Client} = require('pg')
let query = ``

/* Inputs:
    filePath: CSV file to load from
    callback: function to call on each line of CSV
    limit: total number of lines to evaluate
    chunk: number of lines to evaluate before adding to database
*/
const loadRecords = (filePath, callback, limit, chunk) => {
  filePath = filePath || '../extracts/questions.csv'
  callback = callback || require('./queryUtilities.js').translateQuestion
  limit = limit || 1000
  chunk = chunk || 100

  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  // Create postgreSQL connection
  const client = new Client({
    host: 'localhost',
    // user: 'root',
    port: 5432,
    // password: 'rootUser',
    database: 'sdc'
  })

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
    let count = 0;

    for await (const line of rl) {
      // Skip header line
      if (count === 0) {
        count++
        continue;
      }

      // testing limit
      if (count > limit) {break;}

      query += callback(line)

      // Save to database every few thousand
      if (count % chunk === 0) {

        saveChunk(query, count)
        query = ''
      }

      count++
    }
    console.log(`total of ${count} rows loaded`)
  }




  client.connect();

  // Process Data
  processLineByLine()
}

module.exports.loadRecords = loadRecords
