const loadRecords = require('./loadUtilities.js').loadRecords
const queryUtilities = require('./queryUtilities.js')

async function loadAll () {
  // Questions
  // await loadRecords('../extracts/questions.csv', queryUtilities.translateQuestion, 10000000000, 10000)

  // Answers
  // await loadRecords('../extracts/answers.csv', queryUtilities.translateAnswer, 10000000000, 10000, 6860001)

  // Answer Photos
  await loadRecords('../extracts/answers_photos.csv', queryUtilities.translateAnswerPhotos, 10, 2)


  // console.log('finished loading!')

}

loadAll()
  // .then((res) => {
  //   console.log('yep', res)
  // })
