// Contains all functions to run on each line of a CSV file as it's being loaded
// Converts each line into a Postgres query line that can be executed

// I: line of CSV file
// O: Postgres query string that can be run to load that line into database

const csvToArray = require('./csvUtilities.js').toArray

const translateQuestion = (line) => {

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

  return queryLine
}

module.exports.translateQuestion = translateQuestion