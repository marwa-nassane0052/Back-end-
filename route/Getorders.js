const express = require('express');
const router = express.Router();

const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'marwa@123456789marwa',
  database: 'database',
});

conn.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

//get all the orders of table shiping info

router.get('/allorders', (req, res) => {
  const sql = 'SELECT * FROM shipping_info';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
      console.log('Résultat de la requête SQL :', result);
      res.json(result);
    }
  });
});

//get the 5 laste cleint in the dta base
router.get('/newcleint', (req, res) => {
  const sql = 'SELECT * FROM user ORDER BY id DESC LIMIT 6';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
     
      res.json(result);
    }
  });
});


//gettotelprofit
router.get('/profit',(req,res)=>{
  const sql = 'SELECT sum(totalePrice) as sum FROM shipping_info';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
      console.log('Résultat de la requête SQL :', result);
      
      const sum = result[0].sum;
      res.json(sum);
     
    }
  });
})
//getnumber of order
router.get('/ordernumber',(req,res)=>{
  const sql = 'SELECT count(id) as number  FROM shipping_info ';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
   
      const number = result[0].number;
      res.json(number);
    }
  });
})

//get the number of cleint
router.get('/cleint',(req,res)=>{
  const sql = 'SELECT count(id) as number  FROM user';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
      console.log('Résultat de la requête SQL :', result);
      const number = result[0].number;
      res.json(number);
     
    }
  });
})
//get the contity of each product by size
router.get('/product',(req,res)=>{
  const sql = 'SELECT Sstock+Lstock+Mstock+XLstock+XXLstock as sum FROM product group by id';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
     
      res.json(result);
    }
  });
})
 

//all the nuber of all product 
router.get('/products',(req,res)=>{
  const sql = 'SELECT sum(Sstock)+sum(Lstock)+sum(Mstock)+sum(XLstock)+sum(XXLstock) as sum FROM product';
  conn.query(sql, (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ error: 'Erreur lors de l\'exécution de la requête SQL' });
    } else {
     
      res.json(result);
    }
  });
})
module.exports = router;
