const connectCreditCard = require('../database');

const CreateTable=`
CREATE TABLE IF NOT EXISTS credit_card(
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    card_Number INT(20) NOT NULL,
    sold FLOAT
)
`
connectCreditCard.query(CreateTable, (error, result) => {
    if (error) {
      console.error('Error creating product table: ', error);
      return;
    }
    console.log('credit card table created  successfully!');
   connectCreditCard.end(); // close the MySQL connection
  });

  module.exports=connectCreditCard