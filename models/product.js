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

const createnewProducttable=`
ALTER TABLE product
ADD img2 VARCHAR(255) NOT NULL,
ADD img3 VARCHAR(255) NOT NULL,
ADD img4 VARCHAR(255) NOT NULL,
ADD Sstock INT NOT NULL,
ADD Mstock INT NOT NULL,
ADD Lstock INT NOT NULL,
ADD XLstock INT NOT NULL,
ADD XXLstock INT NOT NULL,
ADD category  VARCHAR(255) NOT NULL
`
connection.query(createnewProducttable, (error, result) => {
  if (error) {
    console.error('Error creating product table: ', error);
    return;
  }
  console.log('producte table change successfully!');
 connection.end(); // close the MySQL connection
});

const createWishListe =`
CREATE TABLE IF NOT EXISTS wishlist (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  UNIQUE KEY user_product_unique (user_id,product_id),
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (product_id) REFERENCES product(id)
)
`



connection.query(createUserTableQuery, (error, result) => {
  if (error) {
    console.error('Error creating product table: ', error);
    return;
  }
  console.log('Users product created successfully!');
 connection.end(); // close the MySQL connection
});

connection.query(createWishListe, (error, result) => {
  if (error) {
    console.error('Error creating product table: ', error);
    return;
  }
  console.log('wishlist table created successfully!');
 connection.end(); // close the MySQL connection
});





 module.exports=connection