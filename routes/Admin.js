const express = require('express');
const router = express.Router();
let mysql = require('mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require("nodemailer");
const { appendFile } = require('fs');

    // Defining key
const key = crypto.randomBytes(32);

// Defining iv
const iv = crypto.randomBytes(16);

let db = mysql.createConnection({
    host: '54.71.40.98',
    user: 'server',
    password: 'keyboardPass1.',
    database: 'f1'
});

db.connect(function(err){
    if(err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySql server.');
})

router.post('/SendMail', async (req, res) => {
    await sendmail();
    res.redirect('/admin')
})

router.post('/CreateCrypt', async (req, res) => {
    let encryption = createCrypto('JustinHam');
    console.log(encryption.encryptedData)
    res.redirect('/admin')
})



module.exports = router;

async function sendmail(){
    var transport = nodemailer.createTransport({
        host: `smtp.gmail.com`,
        port: 465,
        secure: true,
        auth: {
            user: "jiheon.ham61@gmail.com",
            pass: "rmqigofpuabmlubo"
        }
    });

    let info = await transport.sendMail({
        from: '"F1 Bets" <NO-REPLY@gmail.com>', // sender address
        to: "jiheon.ham61@gmail.com", // list of receivers
        subject: "Thanks for being a part of F1 bets", // Subject line
        text: "You're gay", // plain text body
        html: "<b>You're gay</b>", // html body
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function createCrypto(text){
    const algorithm = 'aes-256-cbc';
        // Creating Cipheriv with its parameter
        let cipher = crypto.createCipheriv(
             'aes-256-cbc', Buffer.from(key), iv);
        
        // Updating text
        let encrypted = cipher.update(text);
        
        // Using concatenation
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        
        // Returning iv and encrypted data
        return { iv: iv.toString('hex'),
           encryptedData: encrypted.toString('hex') };
}

function decypherCrypt(text){
    
}