const mysql = require("mysql2");
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);   
connection.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database");
});

process.on('exit', () => {
  connection.end();
});

module.exports = connection;
