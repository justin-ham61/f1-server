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