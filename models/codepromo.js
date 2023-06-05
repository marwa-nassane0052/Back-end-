const connection = require('../database');
const createMessageTableQuery = `
CREATE TABLE IF NOT EXISTS codepromo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(255) NOT NULL,
  discount int NOT NULL
)
`;
connection.query(createMessageTableQuery, (error, result) => {
    if (error) {
      console.error('Error altering user table: ', error);
      return;
    }
    console.log('code promo table created successfully!');
    connection.end(); // close the MySQL connection
  });
  module.exports = connection