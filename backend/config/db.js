const mysql = require("mysql2");
const { Client } = require('@elastic/elasticsearch'); // Import the Client from @elastic/elasticsearch


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'westWORLD@123',
  database: 'food_event_db',
};

const connection = mysql.createConnection(dbConfig);
console.log("Connecting to the database",connection);    
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

process.on('exit', () => {
  connection.end();
});

module.exports = connection;
