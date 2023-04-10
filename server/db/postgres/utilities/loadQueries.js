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
  instant = instantToString(instant)

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

const translateAnswer = (line) => {

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
  instant = instantToString(instant)

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
  let queryLine = `INSERT INTO answers (id, question_id, answer_body, instant, answerer_name, answerer_email, reported, helpful) VALUES (${array.join(',')});
  `

  // replace all single quotes with double-singles
  queryLine = queryLine.replaceAll("'", "''")

  // replace all double quotes with single quotes
  queryLine = queryLine.replaceAll('"', "'",)

  return queryLine
}
const addPhotosArrayOnAnswer = (line) => {

   // Split into array to grab values
   let array = line.split(',')

   // If we have errant commas, do some extra processing
   // without this, we will mess up number of columns
   // I'm not performing this on everything to try and speed things up
   if (array.length !== 3) {
     array = csvToArray(line)
   }

   let id = array[0]
   let question_id=array[1]
   let url = array[2]

  //  console.log('array', array)
   /*
   id BIGSERIAL NOT NULL PRIMARY KEY,
   answer_id bigint NOT NULL,
   "url" varchar(1000) NOT NULL,
   */
   // Paste it all back together
   // Query parameters


   let queryLine = `UPDATE answers SET photos = photos || ARRAY['{"id":"${id}", "url":${url}}'::jsonb] where question_id=${question_id};
   `
   // || operator adds values to end of array

   // replace all single quotes with double-singles
  //  queryLine = queryLine.replaceAll("'", "''")

  //  // replace all double quotes with single quotes
  //  queryLine = queryLine.replaceAll('"', "'",)
  //  console.log(queryLine)

   return queryLine
}

const translateAnswerPhotos = (line) => {


  // Split into array to grab values
  let array = line.split(',')

  // If we have errant commas, do some extra processing
  // without this, we will mess up number of columns
  // I'm not performing this on everything to try and speed things up
  if (array.length !== 3) {
    array = csvToArray(line)
  }

  /*
  id BIGSERIAL NOT NULL PRIMARY KEY,
  answer_id bigint NOT NULL,
  "url" varchar(1000) NOT NULL,
  */
  // Paste it all back together
  // Query parameters
  let queryLine = `INSERT INTO answer_photos (id, answer_id, url) VALUES (${array.join(',')});
  `

  // replace all single quotes with double-singles
  queryLine = queryLine.replaceAll("'", "''")

  // replace all double quotes with single quotes
  queryLine = queryLine.replaceAll('"', "'",)

  return queryLine
}

const instantToString = (instant) => {
  let string = new Date(+instant).toString()
  // if invalid date, just set equal to epoch
  if (string === 'Invalid Date') {
    string = 'Thu Jan 01 1970 00:00:00-240'
  }
  string = string.split(' GMT-')[0]
  string = string + '-240'
  return string
}
module.exports.translateQuestion = translateQuestion
module.exports.translateAnswer = translateAnswer
module.exports.translateAnswerPhotos = translateAnswerPhotos
module.exports.addPhotosArrayOnAnswer = addPhotosArrayOnAnswer
module.exports.instantToString = instantToString