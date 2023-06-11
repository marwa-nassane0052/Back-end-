const RessetPassword = require('../database');
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');


router.post('/password-reset', (req, res) => {
    const email = req.body.email;
 
    RessetPassword.query('SELECT * FROM user WHERE email = ?', email, (err, results) => {
     if (err) {
       console.error('Error executing MySQL query:', err);
       res.status(500).json({ message: 'Internal server error' });
       return;
     }
     if (results.length === 0) {
       res.status(404).json({ message: 'User not found' });
        return;
      }
     const user = results[0];
 
     // Generate reset token and save it to the database
     const resetToken = Math.random().toString(36).substr(2)
     RessetPassword.query('UPDATE user SET reset_token = ? WHERE id = ?', [resetToken, user.id], (err, results) => {
       if (err) {
         console.error('Error executing MySQL query:', err);
        res.status(500).json({ message: 'Internal server error' });
        return;
       }
 
        // Send password reset email
       const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eliteawebsite@gmail.com',
            pass: 'mjpolnzknzhxpnyy'
         }
       });
      const mailOptions = {
         from: 'eliteawebsite@gmail.com',
         to: email,
         subject: 'Password reset request',
         text:`Hello ${user.userName},\n\nWe received a request to reset your password. Please click the following link to reset your password:\n\nhttp://localhost:3000/newpassword/${resetToken}\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe team`
        };
       transporter.sendMail(mailOptions, (error, info) => {
             if (error) {
               console.error(error);
             } else {
               console.log('Email sent: ' + info.response);
              }
            });
   });});});

   module.exports = router;
