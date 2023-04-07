const loadRecords = require('./utilities/loadUtilities.js').loadRecords
const queryUtilities = require('./utilities/queryUtilities.js')

async function loadAll () {
  // Questions - total 3510000 / 3518964
  // await loadRecords('../../extracts/questions.csv', queryUtilities.translateQuestion, 10000000000, 100000)

  // Need to run this command after seeding in order to restart the id at a much higher number
  // ALTER SEQUENCE questions_id_seq RESTART WITH 3600000;

  // Answers - total 6860000 / 6879307
  // await loadRecords('../../extracts/answers.csv', queryUtilities.translateAnswer, 10000000000, 100000)

  // ALTER SEQUENCE answers_id_seq RESTART WITH 6900000;

  // Answer Photos - total 2050000 / 2063760
  await loadRecords('../../extracts/answers_photos.csv', queryUtilities.translateAnswerPhotos, 100000000, 100000)

  // ALTER SEQUENCE answer_photos_id_seq RESTART WITH 2070000;


  // console.log('finished loading!')

}

loadAll()

