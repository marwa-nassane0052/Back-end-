const connectUser = require('../database')
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',

  port: 465,
  secure: true,
  auth: {
    user: 'ahlembendouba@gmail.com',
    pass: 'mjpolnzknzhxpnyy',
  
 },
});

// function to send welcome email
const sendWelcomeEmail = (email) => {
 // setup email data
 const mailOptions = {
    from: 'ahlembendouba@gmail.com',
    to: email,
    subject: 'Welcome to Elitea !',
    text: 'Thank you for signing up to Our web Site !',
  };

 // send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
     console.log('Email sent: ' + info.response);
   }
 });
};


router.post('/singup',(req,res)=>{
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
      res.json({ error: 'Email, password, and userName are required' });
      return;
    }

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
        }else{
          sendWelcomeEmail(email)
        }
        const user = {
          id: result.insertId,
          email,
          userName
        };
        res.json(user);
      });
    });
})
router.post('/login',async (req,res)=>{
   
    const { email, password } = await req.body;
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


router.get('/allusers', (req, res) => {
  const sql = 'SELECT * FROM user';
  connectUser.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    } else {
      const users = [];
      result.forEach(row => {
        const user = {
          id: row.id,
          email: row.email,
          userName: row.userName
        };
        users.push(user);
      });
      res.json(users);
    }
  });
});










module.exports = router