const connectUser = require('../database')
const express = require('express')
const router = express.Router()


router.post('/singup',(req,res)=>{
    const { email, password, userName } = req.body;

    // Check if email already exists in the database
    const checkEmailSql = 'SELECT * FROM user WHERE email = ?';
    connectUser.query(checkEmailSql, [email], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      if (result.length > 0) {
        res.status(409).json({ error: 'Email already exists' });
        return;
      }
  
      // If email doesn't exist, create a new user
      const createUserSql = 'INSERT INTO user (email, password, userName) VALUES (?, ?, ?)';
      connectUser.query(createUserSql, [email, password, userName], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        const user = {
          id: result.insertId,
          email,
          userName,
          password
        };
        res.json(user);
      });
    });
})
router.post('/login',(req,res)=>{
    const { email, password } = req.body;
  const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
  connectUser.query(sql, [email, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.json({ error: 'Invalid email or password' });
    } else {
      const user = {
        id: result[0].id,
        email: result[0].email,
        userName: result[0].userName,
        password: result[0].password,
        type: result[0].usertype
      };
      res.json(user);
    }
  });
});




module.exports = router