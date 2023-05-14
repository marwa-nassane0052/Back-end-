const connection = require('../database');

const ChangeONCard=`
ALTER TABLE card
ADD quantity int NOT NULL,
ADD size VARCHAR(10) NULL,
ADD color  VARCHAR(10) NULL
`
connection.query(ChangeONCard, (error, result) => {
    if (error) {
      console.error('Error add cahnges onproduct table: ', error);
      return;
    }
    console.log('adding changes on cardtable  successfully!');
   connection.end(); // close the MySQL connection
  });

  module.exports=connection