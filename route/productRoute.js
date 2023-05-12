const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const express = require('express');
const router = express.Router()

const mysql = require('../database')


router.post('/addproduct', upload.fields([
  { name: 'img' },
  { name: 'img2' },
  { name: 'img3' },
  { name: 'img4' }
]),function(req,res){
  const { name, description, price, color, Sstock, Mstock, Lstock, XLstock, XXLstock, category } = req.body;
  const { img, img2, img3, img4 } = req.files;

    const sql='INSERT INTO product (name, description, price, color, Sstock, Mstock, Lstock, XLstock, XXLstock, category,img, img2, img3, img4) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    const  values =[name, description, price, color, Sstock, Mstock, Lstock, XLstock, XXLstock || 0,category,img[0].filename, img2[0].filename, img3[0].filename, img4[0].filename];
   
    mysql.query(sql,values,function(err){
      if (err) {
        console.error(err);
        res.status(500).send('Error saving data to database');
        return;
      }
  
      res.status(200).send('Data saved to database');
    })
  
  })

  const cors = require('cors');

router.get('/getallprod',cors(), (req, res) => {
  const sql = 'SELECT * FROM product';
  mysql.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    res.json(results);
  });
})

router.delete('/deleted/:id', (req, res) => {
  const id = req.params.id;

  mysql.query('DELETE FROM card WHERE product_id = ?', [id], (error, cartResults) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }
    
    mysql.query('DELETE FROM wishlist WHERE product_id = ?', [id], (error, wishlistResults) => {
      if (error) {
        console.log(error);
        res.sendStatus(500);
        return;
      }

      mysql.query('DELETE FROM product WHERE id = ?', [id], (error, productResults) => {
        if (error) {
          console.log(error);
          res.sendStatus(500);
          return;
        }

        res.send("Deleted");
      });
    });
  });
});



router.get('/product/:id', (req, res) => {
  const productId = req.params.id;

  // Query the MySQL database for the product with the specified ID
  const sql = 'SELECT * FROM product WHERE id = ?';
  mysql.query(sql, [productId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      console.log(result);
      res.status(200).send(result[0]); // Return the queried product data as a JSON object
    }
  });
});
 
  module.exports=router

