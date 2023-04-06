const client = require('../../db/postgres/connection.js').client

module.exports = {

  get: function (req, res) {
    let product_id = req.options.params.product_id

    if (product_id === undefined) {
      res.status(404).send('Must provide a "product_id" parameter')
    }

    var queryStr =
      `select questions.id as "_id", questions.question_body, questions.instant, questions.asker_name, questions.asker_email, questions.reported, questions.helpful, \
       answers.id as "answer_id",  answers.question_id, answers.answer_body, answers.answerer_name, answers.answerer_email, answers.helpful as "answer_helpful", answers.reported as "answers_reported",  answers.instant as "answer_instant" from questions\
      left outer join answers on (questions.id = answers.question_id)\
      where questions.product_id=${product_id} \
      `// order by instant desc';

    client.query(queryStr, (err, data) => {
      if (!err) {
        console.log(`got your stuff!`)
        let payload = {}
        payload.product_id = product_id
        payload.results = []

        let obj = {}
        let prevID

        // convert into format we'd expect
        for (var i = 0; i < data.rows.length; i++) {
          let row = data.rows[i]

          if (row._id !== prevID) {
            if (i > 0) {payload.results.push(obj)} // push old object
            obj = {}
            obj.answers = {}
          }

          obj.question_id = row._id
          obj.question_body = row.question_body
          obj.question_date = row.instant
          obj.asker_name = row.asker_name
          obj.question_helpfulness = row.helpfulness
          obj.reported = row.reported
          obj.answers[row.answer_id] = {
            'id': row.answer_id,
            'body': row.answer_body,
            'date': row.answer_instant,
            'answerer_name': row.answerer_name,
            'helpfulness': row.answer_helpful,
            'photos': []
          }


          prevID = row._id

        }


        res.send(payload)
      } else {
        console.log('err', err.message)
      }
      // client.end()
    })
  },


  post: function (req, res) {
    var params = [req.body.message, req.body.username, req.body.roomname];
    models.questions.create(params, function(err, results) {
      if (err) {
        console.error('Unable to post questions to the database: ', err);
        res.sendStatus(500);
      }
      res.sendStatus(201);
    });
  }
  };
