const connectShipinginfo = require('../database');

const CreateTable=`
CREATE TABLE IF NOT EXISTS shipping_info(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    userName VARCHAR(255) NOT NULL,
    phone_number INT(20),
    address VARCHAR(255) NOT NULL,
    totalePrice FLOAT NOT NULL
)
`

connectShipinginfo.query(CreateTable, (error, result) => {
    if (error) {
      console.error('Error creating product table: ', error);
      return;
    }
    console.log('shiping info table created  successfully!');
   connectShipinginfo.end(); // close the MySQL connection
  });

 
  module.exports=connectShipinginfo