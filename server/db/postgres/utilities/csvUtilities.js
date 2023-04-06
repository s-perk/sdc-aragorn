// If we have commas or special characters within blocks of text, it could mess up normal CSV parsing.
// This function cleans CSV data to maintain the CSV formatting.

// I: String
// O: Array properly delimited as intended within a CSV file
const toArray = (text) => {
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

module.exports.toArray = toArray