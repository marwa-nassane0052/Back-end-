const payment = require('../database');
const express = require('express');
const router = express.Router();

router.post('/payment/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const fullName = req.body.userName;
  const address = req.body.address;
  const number_card = req.body.card_Number;
  const totalPrice=req.body.totalPrice
  const phone_number=req.body.phone_number

  //check if the totale price is define or note
  if (typeof totalPrice === 'undefined') {
    return res.status(400).json({
      message: 'Total price is not defined'
    });
  }
  // Retrieve the cart items for the user
  payment.query('SELECT * FROM card WHERE user_id = ?', [user_id], (error, results) => {
    if (error) {
      return res.status(500).json({
        message: 'Failed to retrieve cart items',
        error: error.message
      });
    }
    if (results.length === 0) {
      return res.status(400).json({
        message: 'Cart is empty'
      });
    }
     
    //get all the product in the table
    const productUpdates = [];

    // Iterate through the cart items and create the product updates
    for (let i = 0; i < results.length; i++) {
      const { product_id, size,quantity} = results[i];
      productUpdates.push({ id: product_id, size: size ,quantity:quantity });
    }
    

    // Verify if the user has enough credit card balance to place the order
    payment.query('SELECT sold FROM credit_card WHERE card_Number = ?', [number_card], (error, results) => {
      if (error) {
        return res.status(500).json({
          message: 'Failed to verify credit card balance',
          error: error.message
        });
      }

      if (results.length === 0) {
        return res.json({
          message: 'Credit card not found for the user'
        });
      }

      const sold = results[0].sold;

      if (sold < totalPrice) {
        return res.json({
          message: 'Not enough credit card balance to place the order'
        });
      }

      // Insert the shipping information into the database
      payment.query('INSERT INTO shipping_info (user_id, userName, address, phone_number,totalePrice) VALUES (?, ?, ?, ?,?)', [user_id, fullName, address,phone_number,totalPrice], (error, results) => {
        if (error) {
          return res.status(500).json({
            message: 'Failed to add shipping information',
            error: error.message
          });
        }

        // Update the credit card balance
        payment.query('UPDATE credit_card SET sold = sold - ? WHERE user_id = ?', [totalPrice, user_id], (error, results) => {
          if (error) {
            return res.status(500).json({
              message: 'Failed to update credit card balance',
              error: error.message
            });
          }

          // Clear the cart items for the user
          payment.query('DELETE FROM card WHERE user_id = ?', [user_id], (error, results) => {
            if (error) {
              return res.status(500).json({
                message: 'Failed to clear cart items',
                error: error.message
              });
            }



            for (let i = 0; i < productUpdates.length; i++) {
              const productId = productUpdates[i].id;
              const size = productUpdates[i].size;
              const quantity = productUpdates[i].quantity;
            
              // Update the stock for the selected size
              let updateQuery = '';
              switch (size) {
                case 'S':
                  updateQuery = `UPDATE product SET Sstock =  Sstock - ${quantity} WHERE id = ${productId}`;
                  break;
                case 'M':
                  updateQuery = `UPDATE product SET Mstock = Mstock - ${quantity} WHERE id = ${productId}`;
                  break;
                case 'L':
                  updateQuery = `UPDATE product SET Lstock = Lstock - ${quantity} WHERE id = ${productId}`;
                  break;

                  case 'XL':
                  updateQuery = `UPDATE product SET XLstock = Xlstock - ${quantity} WHERE id = ${productId}`;
                  break;

                  case 'XXL':
                  updateQuery = `UPDATE product SET XXLstock = XXMstock - ${quantity} WHERE id = ${productId}`;
                  break;
                default:
                
              }
            
              // Execute the update query
              payment.query(updateQuery, (error, results) => {
                if (error) throw error
                return;
              });
            }

            // Return a success message to the client
            res.json({
              message: 'Order placed successfully'
            });
          });
        });
      });
    });
  });
});



module.exports = router;
