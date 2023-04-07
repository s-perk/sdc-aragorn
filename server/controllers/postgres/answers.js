const client = require('../../db/postgres/connection.js').client
const instantToString = require('../../db/postgres/utilities/queryUtilities.js').instantToString

module.exports = {

  get: function (req, res) {

    let question_id = req.params.question_id

    if (question_id === undefined) {
      res.status(404).send('Must provide a "question_id" parameter')
    }

    var queryStr =
      // `select answers.id as "answer_id",  answers.question_id, answers.answer_body, answers.answerer_name, answers.answerer_email, answers.helpful as "answer_helpful", answers.reported as "answers_reported",  answers.instant as "answer_instant" from answers\
      `select answers.id, answers.answer_body, answers.answerer_name, answers.answerer_email, answers.helpful, answers.reported,  answers.instant, \
      answer_photos.id as "photo_id", answer_photos.url\
      from answers\
      left outer join answer_photos on(answers.id = answer_photos.answer_id)\
      where question_id=${question_id} \
      `// order by instant desc';

    client.query(queryStr)
    .then((data) => {
      let payload = {}

      payload.question = question_id
      payload.page = req.params.page || 1
      payload.count = req.params.count || 5
      payload.results = []

      let obj = {}
      let prevAid
      // Loop through each row and parse into expected format
      // Each row = 1 question + answer + url
      for (var i = 0; i < data.rows.length; i++) {
        let row = data.rows[i]

        // Process Answers
        if (row.id !== prevAid) {
          if (i > 0) {
            payload.results.push(obj)
          }
          obj = {
            "answer_id": +row.id,
            "body": row.answer_body,
            "date": row.instant,
            "answerer_name": row.answerer_name,
            "answerer_email": row.answerer_name,
            "helpfulness": row.helpful,
            "photos": []
          }

        }

        // Process Photos
        if (row.url !== null) {
          obj.photos.push(
            {
              id: row.photo_id,
              url: row.url
            }
          )
        }

        // handle if only one result
        if (data.rows.length === 1) {
          payload.results.push(obj)
        }

        prevAid = row.answer_id
        prevPid = row.photo_id
      }
      return payload
    }).then((payload) => {
      res.send(payload)
    }).catch ((err) => {
      console.log('error', err)
    })
  },


  post: function (req, res) {
    if (req.params.question_id === undefined) {
      res.status(404).send('Must provide a "question_id" parameter')
    }

    let body = req.body.body
    body = body.replace("'", "''")

    let instant = instantToString(Date.now())


    let queryStrAnswers =
    `INSERT INTO answers (question_id, answer_body, instant, answerer_name, answerer_email, reported, helpful)
    VALUES (${req.params.question_id}, '${body}', '${instant}', '${req.body.name}', '${req.body.email}', false, 0)
    RETURNING id;
    `

    client.query(queryStrAnswers)
      .then((data, err) => {
        let answer_id = data.rows[0].id
        let queryStrAnswerPhotos = ``
        req.body.photos.forEach((url) => {
          queryStrAnswerPhotos += `INSERT INTO answer_photos (answer_id, url) VALUES (${answer_id}, '${url}');`

        })

        // then run query  on photos
        client.query(queryStrAnswerPhotos)
          .then((data) => {
            res.status(201).send('Status: 201 CREATED')
          })
      })

  },


  helpful: function (req, res) {

    if (req.params.answer_id === undefined) {
      res.status(404).send('Must provide a "answer_id" parameter')
    }

    let queryStr =
    `UPDATE answers SET helpful = helpful+1 WHERE id = ${req.params.answer_id};
    `


    client.query(queryStr)
      .then((data) => {
        res.status(201).send('Status: 201 UPDATED')
      })
      .catch((err) => {
        console.log('helpful save error!')
      })

  },

  report: function (req, res) {

    if (req.params.answer_id === undefined) {
      res.status(404).send('Must provide a "answer_id" parameter')
    }

    let queryStr =
    `UPDATE answers SET reported = true WHERE id = ${req.params.answer_id};
    `


    client.query(queryStr)
      .then((data) => {
        res.status(201).send('Status: 201 UPDATED')
      })
      .catch((err) => {
        console.log('helpful save error!')
      })

  }
};
