const axios = require('axios')
const client = require('../db/postgres/connection.js').client
let data = {}

let params = {
  'product_id': 37325,
  'count': 1000
}

let question_post = {
  "product_id": 37325,
  "body": "what can i say",
  "name": "jbeebs",
  "email": "asdf@adsf.com"
}

describe('Questions GET route', () => {

  test('should return an object', async () => {
    await axios.get('http://localhost:3000/qa/questions', {params:params}).then((res) => {
      data = res.data
    })
    expect(typeof data).toBe('object')
    expect(data.product_id).toBe('37325')
    expect(data.results[0].question_id).toBe('3600000')
  })


  test('should return the correct product id and question id', async () => {
    await axios.get('http://localhost:3000/qa/questions', {params:params}).then((res) => {
      data = res.data
    })

    expect(data.product_id).toBe('37325')
    expect(data.results[0].question_id).toBe('3600000')
  })

  test('should contain an array of answers', async () => {
    await axios.get('http://localhost:3000/qa/questions', {params:params}).then((res) => {
      data = res.data
    })

    // Test that we have any answers
    expect(!!data.results[0].answers).toBe(!undefined)

    // Test that we have answer 6900000
    expect(!!data.results[0].answers[6900000]).toBe(!undefined)
  })


  test('should contain an array of answer photos (if they exist)', async () => {
    await axios.get('http://localhost:3000/qa/questions', {params:params}).then((res) => {
      data = res.data
    })

    // Test that we have answers with photos
    expect(!!data.results[3].answers[256140].photos).toBe(!undefined)
  })

})







describe('Questions POST route', () => {

  test('should successfully post question', async () => {
       await axios.post('http://localhost:3000/qa/questions', question_post).then((res) => {
      data = res.data
    })
    expect(data).toBe('Status: 201 CREATED')
  })

  test('should add a single question to the database', async () => {
    let count = 0
    let newCount = 0
    await client.query('select count(id) from questions;')
            .then((data) => {
                count = +data.rows[0].count
            })

    await axios.post('http://localhost:3000/qa/questions', question_post)

    await client.query('select count(id) from questions;')
    .then((data) => {
        newCount = +data.rows[0].count
    })

    client.end()

    expect(newCount).toBe(count + 1)

  })


  // test('should return the correct product id and question id', async () => {
  //   await axios.get('http://localhost:3000/qa/questions', {
  //     params: {
  //       'product_id': 37325,
  //       'count': 1000
  //     }
  //   }).then((res) => {
  //     data = res.data
  //   })

  //   expect(data.product_id).toBe('37325')
  //   expect(data.results[0].question_id).toBe('3600000')
  // })
})

