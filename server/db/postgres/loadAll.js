const loadRecords = require('./utilities/loadUtilities.js').loadRecords
const loadQueries = require('./utilities/loadQueries.js')

async function loadAll () {
  // Questions - total 3510000 / 3518964
  // await loadRecords('../../extracts/questions.csv', loadQueries.translateQuestion, 10000000000, 100000)

  // Answers - total 6860000 / 6879307
  // await loadRecords('../../extracts/answers.csv', loadQueries.translateAnswer, 10000000000, 100000)

  // Answer Photos - total 2050000 / 2063760
  // await loadRecords('../../extracts/answers_photos.csv', loadQueries.translateAnswerPhotos, 100000000, 100000)

  // Answer Photos - total 2050000 / 2063760
  await loadRecords('../../extracts/answers_photos.csv', loadQueries.addPhotosArrayOnAnswer, 100000000, 100000, 15852)


}

loadAll()

