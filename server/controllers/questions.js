const client = require('../db/connection.js').client

module.exports = {

  get: function (req, res) {
    let product_id = req.options.params.product_id

    if (product_id === undefined) {
      res.status(404).send('Must provide a "product_id" parameter')
    }

    var queryStr =
      `select * from questions\
      left outer join answers on (questions.id = answers.question_id)\
      where questions.product_id=${product_id} \
      `// order by instant desc';

    client.query(queryStr, (err, data) => {
      if (!err) {
        console.log(`got your stuff!`)
        res.send(data.rows)
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
