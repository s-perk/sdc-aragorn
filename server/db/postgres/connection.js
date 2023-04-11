const {Client} = require('pg')

// Create postgreSQL connection
const client = new Client({
  // host: 'localhost',
  host: 'db', // when deploying through Docker, this should match the hostname of the database docker container
  user: 'docker', // this should match the user/password in "dockerfile"
  password: '123456',
  // port: 5432,
  database: 'docker'
})

client.connect();

module.exports.client = client;