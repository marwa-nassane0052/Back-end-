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
module.exports=router