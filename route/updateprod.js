



const express = require('express');
const router = express.Router()

const update = require('../database');




// Update product route
router.put('/products/:id', (req, res) => {
  const productId = req.params.id;
  const { name, description, price, img,img2,img3,img4, color, Sstock, Mstock, Lstock, XLstock, XXLstock } = req.body;

  // Construct the SQL query
  const query = `
    UPDATE product
    SET name = ?, description = ?, price = ?, img = ?,img2=?,img3=?,img4=?, color = ?, Sstock = ?, Mstock = ?, Lstock = ?, XLstock = ?, XXLstock = ?
    WHERE id = ?
  `;

  // Execute the query with the provided values
  update.query(
    query,
    [name, description, price, img,img2,img3,img4, color, Sstock, Mstock, Lstock, XLstock, XXLstock, productId],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    }
  );
});




 module.exports = router  