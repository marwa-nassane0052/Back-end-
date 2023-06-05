const connection = require('../database');
const createMessageTableQuery = `
CREATE TABLE IF NOT EXISTS message (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL,
  email VARCHAR(30) NOT NULL,
  message VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NOT NULL
)
`;
connection.query(createMessageTableQuery, (error, result) => {
    if (error) {
      console.error('Error altering user table: ', error);
      return;
    }
    console.log('message table creayed successfully!');
    connection.end(); // close the MySQL connection
  });
  module.exports = connection