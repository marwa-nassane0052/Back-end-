const connection = require('../database');

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS user (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  userName VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;
const alterUserTableQuery1 = `
ALTER TABLE user
ADD COLUMN usertype ENUM('admin', 'client')   DEFAULT 'client' 

`;

connection.query(alterUserTableQuery1, (error, result) => {
    if (error) {
      console.error('Error altering user table: ', error);
      return;
    }
    console.log('User table altered successfully!');
    connection.end(); // close the MySQL connection
  });

connection.query(createUserTableQuery, (error, result) => {
    if (error) {
      console.error('Error creating users table: ', error);
      return;
    }
    console.log('Users table created successfully!');
    connection.end(); // close the MySQL connection
  });
  module.exports = connection