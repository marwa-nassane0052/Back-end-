const connection = require('../database');


const createCard=`
CREATE TABLE IF NOT EXISTS card(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  product_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES product(id),
  price FLOAT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  quantity int NOT NULL,
  size VARCHAR(10) NOT NULL,
  color VARCHAR(10) NOT NULL,
  CONSTRAINT user_product_unique_two UNIQUE (user_id, color, size)
);
`
connection.query(createCard, (error, result) => {
    if (error) {
      console.error('Error creating product table: ', error);
      return;
    }
    console.log('carde newwwwwwwwwtable created  successfully!');
   connection.end(); // close the MySQL connection
  });


module.exports=connection