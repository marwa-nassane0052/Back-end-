const connection = require('../database');


const dropcolum = `
ALTER TABLE product
DROP COLUMN   size
`;
connection.query(dropcolum, (error, result) => {
  if (error) {
    console.error('Error creating product table: ', error);
    return;
  }
  console.log('size colum dropsuccessfully!');
 connection.end(); // close the MySQL connection
});
module.exports=connection