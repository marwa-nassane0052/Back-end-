const connectCart = require('../database')
const express = require('express')
const router = express.Router()

router.post('/addtocart',(req,res)=>{
    const { userId, productId ,price,quantity,size,color} = req.body;
    connectCart.query(
    'INSERT INTO card (user_id, product_id,price,quantity,size,color) VALUES (?, ?,?,?,?,?)',
    [userId, productId,price,quantity,size,color],
    (err, results) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error adding item to cart');
      } else {
        res.status(200).send('Item added to cart');
      }
    }
  );
})

router.get('/get/:userId',(req,res)=>{
    const userId = req.params.userId;
    let sql = `SELECT product.id, product.name, product.description,product.price, product.img,card.color,card.size,card.quantity 
               FROM product 
               JOIN  card ON card.product_id = product.id 
               WHERE card.user_id = ?`;
    connectCart.query(sql, [userId], function(error, results, fields) {
      if (error) throw error;
      res.json(results);
      console.log('Results:', results);
    });
})


router.delete('/remove', (req, res) => {
  const { userId, productId,size,color } = req.body;
  const removeProductSql = 'DELETE FROM card WHERE user_id = ? AND product_id = ? and size=? and color=?' ;
  connectCart.query(removeProductSql, [userId, productId,size,color], (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: `Product ${productId} removed from cart of user ${userId}` });
  });
});

router.get('/numberOfItem/:userId',(req,res)=>{
  const userId = req.params.userId;
  const sql = `SELECT COUNT(product_id) AS numberOfItem FROM card WHERE user_id=${userId}`;
  connectCart.query(sql, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result[0].numberOfItem); // return just the numberOfItem value
    }
  });
})

router.post('/check-cart-quantity', (req, res) => {
  const { user_id, cart_items } = req.body;

  const insufficientStockItems = [];

  let processedItemsCount = 0;

  // Check each item in the cart
  for (const cartItem of cart_items) {
    const { product_id, size, quantity } = cartItem;

    // Generate the column name based on the size (e.g., Sstock, Lstock, XLstock)
    const column = `${size}stock`;

    // Query the database to check the cart quantity against stock
    connectCart.query(
      `SELECT ?? AS stock
      FROM product
      WHERE id = ?`,
      [column, product_id],
      (err, results) => {
        if (err) {
          console.error('Error querying MySQL:', err);
          res.status(500).json({ error: 'An internal server error occurred' });
          return;
        }

        if (results.length === 0) {
          // Product not found
          insufficientStockItems.push({
            product_id,
            size,
            quantity_in_cart: quantity,
            stock: 0
          });
        } else {
          const stock = results[0].stock;

          if (quantity > stock) {
            // Insufficient stock
            insufficientStockItems.push({
              product_id,
              size,
              quantity_in_cart: quantity,
              stock
            });
          }
        }

        processedItemsCount++;

        // Check if all items have been processed
        if (processedItemsCount === cart_items.length) {
          if (insufficientStockItems.length === 0) {
            // Sufficient stock for all cart items
            res.json({ message: 'Sufficient stock for all cart items' });
          } else {
            // Insufficient stock for some cart items
            res.json({
              message: 'Insufficient stock for some cart items',
              insufficientStockItems
            });
          }
        }
      }
    );
  }
});

router.put('/orders', (req, res) => {
  const orderUpdates = req.body;

  const updatePromises = orderUpdates.map((update) => {
    const { orderId, status } = update;
    return new Promise((resolve, reject) => {
      // Update the status of the order in the database
      const query = `UPDATE shipping_info SET status = '${status}' WHERE id = ${orderId}`;
      connectCart.query(query, (error, result) => {
        if (error) {
          console.error('Error updating order status:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  });

  Promise.all(updatePromises)
    .then(() => {
      res.status(200).send('Order statuses updated successfully');
    })
    .catch((error) => {
      console.error('Error updating order statuses:', error);
      res.status(500).send('Internal Server Error');
    });
});


module.exports=router