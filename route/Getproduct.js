const GetProduct = require('../database')
const express = require('express')
const router = express.Router()



router.get('/:category', (req, res) => {
  const { category } = req.params;

  // Select all products with the same category
  GetProduct.query('SELECT * FROM product WHERE category = ?', [category], (error, results, fields) => {
    if (error) {
      console.log(error);
      res.sendStatus(500);
      return;
    }

    res.json(results);
  });
});

module.exports= router