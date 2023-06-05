const msg = require('../database')
const express = require('express')
const router = express.Router()


router.post('/commentaire', (req, res) => {
    const { name, phone,email, message } = req.body;
  
    const sql = 'INSERT INTO message (name, phone,email, message) VALUES (?,?,?, ?)';
    const values = [name, phone,email, message];
  
    msg.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la création du commentaire :', err);
        res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
        return;
      }
  
      res.json({ comment_id: result.insertId });
    });
  });

  router.get('/getcommentaire', (req, res) => {
    const sql = 'SELECT * FROM  message';
  
    msg.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
        return;
      }
  
      res.json(results);
    });
  });


module.exports = router