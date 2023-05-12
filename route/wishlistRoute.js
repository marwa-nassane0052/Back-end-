const connectWishlist = require('../database')
const express = require('express')
const router = express.Router()

router.post('/add',(req,res)=>{
    const { userId, productId } = req.body;
  
    const sql = `INSERT INTO wishlist (user_id, product_id) VALUES (${userId}, ${productId}) 
                 ON DUPLICATE KEY UPDATE user_id=${userId}, product_id=${productId}`;
    // Execute the query to add/update the favorite item in the database
    connectWishlist.query(sql, function(err, result) {
      if (err) {
        console.error(err);
        res.status(500).send('Error adding favorite item');
      } else {
        res.status(200).send('Favorite item added/updated successfully');
      }
    });
})

router.get('/get/:userId', (req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT product.id, product.name, product.description,product.price, product.img
               FROM product 
               JOIN wishlist ON wishlist.product_id = product.id 
               WHERE wishlist.user_id = ?`;
    connectWishlist.query(sql, [userId], function(error, results, fields) {
      if (error) throw error;
      res.json(results);
      console.log('Results:', results);
    });
  });
  

router.delete('/remove',(req,res)=>{
  const { userId, productId } = req.body;
  const sql = `DELETE FROM wishlist WHERE user_id = ${userId} AND product_id = ${productId}`;
  // Execute the query to remove the favorite item from the database
  connectWishlist.query(sql, function(err, result) {
    if (err) {
      console.error(err);
      res.status(500).send('Error removing favorite item');
    } else if (result.affectedRows === 0) {
      res.status(404).send('Favorite item not found');
    } else {
      res.status(200).send('Favorite item removed successfully');
    }
  });
}) 

router.get('/numberOfItem/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `SELECT COUNT(product_id) AS numberOfItem FROM wishlist WHERE user_id=${userId}`;
  connectWishlist.query(sql, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(result[0].numberOfItem); // return just the numberOfItem value
    }
  });
});
module.exports= router