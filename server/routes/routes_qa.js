const path = require('path')
const {Router} = require('express')
const router = Router()
const axios = require('axios')
const dotenv = require('dotenv')
const { ConcatenationScope } = require('webpack')
const controller = require('../controllers/postgres')

// Heroku API info
const HEROKU_API_END_POINT = 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe'
const HEROKU_HEADERS = {
  "Authorization" : `${process.env.API_KEY}`
}



// =====================================
//         Things to do for all...
// =====================================


router.all('*', (req, res, next) => {

  // Set options with our authorization and any passed in query parameters
  let options = {
    headers: HEROKU_HEADERS,
    params: req.query
  }

  // Attach to our request object
  req.options = options

  // Add Access Control to Response header to avoid web request error
  // https://stackoverflow.com/questions/45975135/access-control-origin-header-error-using-axios
  res.header("Access-Control-Allow-Origin", "*");

  next()
})
// =====================================
//                GET
// =====================================

// -------------------------------------
//              PRODUCTS
// -------------------------------------


// // ----- PRODUCTS / ID -----
router.get('/products/:product_id', (req, res) => {

  axios.get(`${HEROKU_API_END_POINT}/products/${req.params.product_id}`, req.options)
    .then ((result) => {
      res.send(result.data)
    })
    .catch((err) => {
      console.log(err)
    })
})



// -------------------------------------
//              Q&A
// -------------------------------------

// ----- Questions -----
router.get('/qa/questions', controller.questions.getWithPhotos)



// ----- Answers -----
router.get('/qa/questions/:question_id/answers', controller.answers.getWithPhotos)

// =====================================
//                POST
// =====================================


// -------------------------------------
//              Q&A
// -------------------------------------

// ----- Questions -----
router.post('/qa/questions', controller.questions.post)



// ----- Answers -----
router.post('/qa/questions/:question_id/answers', controller.answers.post)


// =====================================
//                PUT
// =====================================


// -------------------------------------
//              Q&A
// -------------------------------------

// ----- Mark Question as Helpful -----
router.put('/qa/questions/:question_id/helpful', controller.questions.helpful)

// ----- Report Question -----
router.put('/qa/questions/:question_id/report', controller.questions.report)




// ----- Mark Answer as Helpful -----
router.put('/qa/answers/:answer_id/helpful', controller.answers.helpful)

// ----- Report Answer -----
router.put('/qa/answers/:answer_id/report', controller.answers.report)




module.exports.router = router
