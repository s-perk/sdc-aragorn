const fs = require('fs');
const readline = require('readline');
const Promise = require('bluebird')
const {Client} = require('pg')
let query = ``

const limit = 1000
const chunk = 100

// Note: we use the crlfDelay option to recognize all instances of CR LF
// ('\r\n') in input.txt as a single line break.
const fileStream = fs.createReadStream('questions.csv');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

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

    query += convertLineToQuery(line)

    // Save to database every few thousand
    if (count % chunk === 0) {

      saveChunk(query, count)
      query = ''

    }



    count++
  }


  return true;

}

const csvToArray = (text) => {
  let prev = ''
  let row = ['']
  let i = 0;
  let openQuote = false;

  for (let letter of text) {

    // If comma, check if we have an open quotation mark
    if (letter === ',' && !openQuote) {
      i++
      row[i] =''
    } else if (letter === '"') { // if DoubleQuotes, flag openQuotes starting or ending
      row[i] += letter;
      openQuote = !openQuote;

    } else {
      row[i] += letter;
    }
    prev = letter;
  }
  return row
};



const convertLineToQuery = (line) => {

  // Split into array to grab values
  let array = line.split(',')

  // If we have errant commas, do some extra processing
  // without this, we will mess up number of columns
  // I'm not performing this on everything to try and speed things up
  if (array.length !== 8) {
    array = csvToArray(line)
  }


  // body
  let body = array[2]
  body = body.replaceAll("'", "\'")
  array[2] = body


  // Instant
  let instant = array[3]
  instant = new Date(+instant).toString()
  // if invalid date, just set equal to epoch
  if (instant === 'Invalid Date') {
    instant = 'Thu Jan 01 1970 00:00:00-240'
  }
  instant = instant.split(' GMT-')[0]
  instant = instant + '-240'

  array[3] = `"${instant}"`


  // Reported?
  let reported = array[6]
  if (reported === 1) {
    reported = 'true'
  } else {
    reported = 'false'
  }

  array[6] = reported

  // Paste it all back together
  // Query parameters
  let queryLine = `INSERT INTO questions (id, product_id, question_body, instant, asker_name, asker_email, reported, helpful) VALUES (${array.join(',')});
  `

  // replace all single quotes with double-singles
  queryLine = queryLine.replaceAll("'", "''")

  // replace all double quotes with single quotes
  queryLine = queryLine.replaceAll('"', "'",)

  // console.log('query line: ', queryLine)

  return queryLine

}

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

// Create postgreSQL connection
const client = new Client({
  host: 'localhost',
  // user: 'root',
  port: 5432,
  // password: 'rootUser',
  database: 'sdc'
})

client.connect();

// Process Data
const processLineByLineAsync = Promise.promisify(processLineByLine)
processLineByLineAsync()
  .then((res) => {
    console.log('res', res)
    client.end()
  })
