const connection = require('../database');

const createUserTableQuery = `
CREATE TABLE IF NOT EXISTS product (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  price  DECIMAL(10.0) NOT NULL,
  img VARCHAR(255) NOT NULL,
  size VARCHAR(20) NOT NULL,
  color VARCHAR(30) NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 
)
`;
connection.query(createUserTableQuery, (error, result) => {
  if (error) {
    console.error('Error creating product table: ', error);
    return;
  }
  console.log('Users product created successfully!');
 connection.end(); // close the MySQL connection
});
 module.exports=connection