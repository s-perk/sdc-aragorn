const {Client} = require('pg')

// Create postgreSQL connection
const client = new Client({
  host: 'localhost',
  // host: 'db', // when deploying through Docker, this should match the hostname of the database docker container
  // user: 'docker', // this should match the user/password in "dockerfile"
  // password: '123456',
  // port: 5432,
  database: 'sdc'
})

client.connect();

module.exports.client = client;

// const knex = require('knex')

// module.exports = knex({
//   client: 'postgres',
//   connection: {
//     host: 'db',
//     user: 'docker',
//     password: '123456',
//     database: 'docker',
//   },
// })