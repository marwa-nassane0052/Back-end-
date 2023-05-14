const connection = require('../database');

const ChangeONpRODUCT=`
ALTER TABLE product
ADD color1 VARCHAR(255) NOT NULL,
ADD color2 VARCHAR(255) NOT NULL,
ADD color3 VARCHAR(255) NOT NULL,
ADD CONSTRAINT unique_product UNIQUE (name)
`
connection.query(ChangeONpRODUCT, (error, result) => {
    if (error) {
      console.error('Error add cahnges onproduct table: ', error);
      return;
    }
    console.log('adding changes on product table  successfully!');
   connection.end(); // close the MySQL connection
  });

  module.exports=connection