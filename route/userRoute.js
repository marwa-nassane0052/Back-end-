const connectUser = require('../database')
const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport({
  service: 'gmail',

  port: 465,
  secure: true,
  auth: {
    user: 'eliteawebsite@gmail.com',
    pass: 'tlmisqnimucbjchn',
  
 },
});

// function to send welcome email
const sendWelcomeEmail = (email) => {
 // setup email data
 const mailOptions = {
    from: 'eliteawebsite@gmail.com',
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


const bcrypt = require('bcrypt');
const saltRounds = 10;

router.post('/signup', (req, res) => {
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

    // Hash the password
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // If email doesn't exist, create a new user with hashed password
      const createUserSql = 'INSERT INTO user (email, password, userName) VALUES (?, ?, ?)';
      connectUser.query(createUserSql, [email, hashedPassword, userName], (err, result) => {
        if (err) {
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
        sendWelcomeEmail(email);
        const user = {
          id: result.insertId,
          email,
          userName
        };
        res.json(user);
      });
    });
  });
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const checkUserSql = 'SELECT * FROM user WHERE email = ?';
  connectUser.query(checkUserSql, [email], async (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (result.length === 0) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const user = result[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const userResponse = {
        id: user.id,
        email: user.email,
        userName: user.userName,
        type: user.usertype
      };
      res.json(userResponse);
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
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


//get user by id
router.get('/getorder/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT * FROM shipping_info WHERE user_id = ?";
  connectUser.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ error: "Error retrieving orders" });
    } else {
      res.status(200).json(results);
    }
  });
});










module.exports = router