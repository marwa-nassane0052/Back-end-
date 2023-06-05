const codepromo = require('../database')
const express = require('express')
const router = express.Router()

router.post('/addcodepromo', (req, res) => {
    const {code,discount } = req.body;
  
    const sql = 'INSERT INTO codepromo (code,discount) VALUES (?, ?)';
    const values = [code,discount];
  
    codepromo.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la création du commentaire :', err);
        res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
        return;
      }
  
      res.json({ comment_id: result.insertId });
    });
  });

  router.get('/getcodepromo', (req, res) => {
    const sql = 'SELECT * FROM  codepromo';
  
    codepromo.query(sql, (err, results) => {
      if (err) {
        console.error('Erreur lors de la récupération des commentaires :', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
        return;
      }
  
      res.json(results);
    });
  });

  router.delete('/deletecodepromo/:id', (req, res) => {
    const promoId = req.params.id;
    
    const sql = 'DELETE FROM codepromo WHERE id = ?';
    const values = [promoId];
    
    codepromo.query(sql, values, (err, result) => {
      if (err) {
        console.error('Erreur lors de la suppression du code promo :', err);
        res.status(500).json({ error: 'Erreur lors de la suppression du code promo' });
        return;
      }
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Code promo non trouvé' });
        return;
      }
      
      res.json({ message: 'Code promo supprimé avec succès' });
    });
  });
  
  
  
  

module.exports = router