//connect to data base 
const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'marwa@123456789marwa',
  database: 'database',
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL: ');
      return;
    }
    console.log('Connected to MySQL as id ');
    connection.release();
  });


module.exports = pool;