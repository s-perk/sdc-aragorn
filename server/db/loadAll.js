const loadRecords = require('./loadUtilities.js').loadRecords
const translateQuestion = require('./queryUtilities.js').translateQuestion

loadRecords('../extracts/questions.csv', translateQuestion, 900, 50)