const {Client} = require('pg')

// Create postgreSQL connection
const client = new Client({
  host: 'localhost',
  // user: 'root',
  port: 5432,
  // password: 'rootUser',
  database: 'sdc'
})

client.connect();

module.exports.client = client;