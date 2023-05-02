const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const express = require('express');
const router = express.Router()

const mysql = require('../database')


router.post('/addproduct', upload.single('img'),function(req,res){
    const {name,description, price ,size,color } = req.body;
    const img = req.file.filename;
    const sql='INSERT INTO product (name,description, price ,img,size,color) VALUES (?,?,?,?,?,?)'
    mysql.query(sql,[name,description, price, img,size,color ],function(err){
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
  const  id  = req.params.id;

  mysql.query('DELETE FROM product WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }else{
      res.send("Deleted");
    }

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

