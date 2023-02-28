const express = require('express');
const router = express.Router();
let mysql = require('mysql');
const bcrypt = require('bcrypt');
const crypto = require('crypto')
const nodemailer = require("nodemailer");
const flash = require('connect-flash');


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

router.post('/registerUser', async (req, res) => {
    let userdata = [];
    let err = {email: 0, password: 0};
    let {firstName, lastName, team, dateOfBirth, email, password, passwordConfirm} = req.body;
    let job = "Janitor"
    if (req.body.firstName == "Grace"){
        job = "Team Principal"
    } 

    let encryptedEmail = createCrypto(req.body.email);

    let emailresult = await checkEmail(req.body.email)

    if(emailresult.length > 0){
        err.email = 1;
    } 

    if(password != passwordConfirm){
        err.password = 1;
    }

    if (err.email == 1 || err.password == 1){
        res.redirect('/registration');
    } else {
        bcrypt.hash(password, 10, function(err, hash){
            if (err){
                throw (err)
            } else {
                let values = [firstName, lastName, team, dateOfBirth, email ,hash, job]
                db.query(
                    'INSERT INTO users (FirstName, LastName, Team, Birth, Email, Hash, Job) VALUES (?);',
                    [values],
                    function(err, result){
                        if (err){
                            throw err;
                        } else {
                            res.redirect(307, `/UserAuth/SendEmailVerification/${encryptedEmail.encryptedData}/${req.body.email}`)
                            return;
                        }
                    }
                )
            }
        })
    }
})

router.post('/SendEmailVerification/:encryptedEmail/:email', async (req, res) => {
    let encryptedEmail = req.params.encryptedEmail;
    let email = req.params.email;
    let user_id = await checkEmail(email)
    await addCrypt(user_id[0].user_id, encryptedEmail)
    await sendmail(email, encryptedEmail)
    res.redirect('/EmailConfirm')
})

router.get('/VerifyEmail/:crypt', async (req, res) => {
    let crypt = req.params.crypt;
    let result = await checkCrypt(crypt);
    let user_id = result[0].user_id
    if (result.length > 0){
        await updateUserVerification(user_id)
        deleteCrypt(user_id);
        res.redirect('/login')
    } else {
        res.redirect('/registration')
    }
})

router.post('/loginUser', async (req, res) => {
    let {email, password} = req.body;
    let err = {email: 0, verification: 0}
    let userData = await checkEmail(email);


    console.log(userData[0].Active)
    if (userData.length == 0){
        err.email = 1;
        req.flash('login-error', 'Account With Email Does Not Exist: Please Check Email')
    }
    if (userData[0].Active == 0){
        err.verification = 1;
        req.flash('login-error', 'Email Has Not Been Verified Yet: Please Check Email Inbox')
    }
    if (err.email == 1){
        res.redirect('/login')
    } else if (err.verification == 1) {
        res.redirect('/login')
    } else {
        let hash = await getHash(email);
        let verification = await verifyUser(password, hash)
        if (verification){
            req.session.isAuth = true;
            req.session.firstName = userData[0].FirstName;
            req.session.lastname = userData[0].LastName;
            req.session.user_id = userData[0].user_id;
            req.session.team = userData[0].Team;
            req.session.birth = userData[0].Birth;
            req.session.email = userData[0].Email
            console.log('login successful');
            req.session.save
            console.log('logged in')
            res.redirect('/')
        } else if (!verification){
            console.log('failed log in')
            res.redirect('/login')
        }
    }
})

router.post('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/');
    })
})

// Defining key
const key = crypto.randomBytes(32);

// Defining iv
const iv = crypto.randomBytes(16);

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

function checkEmail(email){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE Email = ?;',
            [email],
            function (err, result){
                if (err){
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

function getHash(email) {
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT Hash FROM users WHERE Email = ?',
            [email],
            function (err, result){
                if (err){
                    reject(err)
                } else {
                    resolve(result[0].Hash)
                }
            }
        )
    })
}

function verifyUser(password, hash){
    return new Promise ((resolve, reject) => {
        bcrypt.compare(password, hash, function(err, result){
            if (err){
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

async function sendmail(email, encryptedEmail){
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
        from: '"F1 Bets" <jiheon.ham61@gmail.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Verify your email", // Subject line
        text: "Email Verification", // plain text body
        html: `<a href="https://localhost:8080/UserAuth/VerifyEmail/${encryptedEmail}">Click to verify email</a>`
      });
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

function addCrypt(user_id, encryptedEmail){
    return new Promise ((resolve, reject) => {
        db.query(
            'INSERT INTO verification (user_id, Hash) VALUES (?, ?)',
            [[user_id], [encryptedEmail]],
            function (err){
                if (err){
                    reject(err);
                } else {
                    console.log("added a crypt")
                    resolve();
                }
            }
        )
    })
}

function checkCrypt(crypt){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT user_id FROM verification WHERE Hash = ?',
            [crypt],
            function (err, result){
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        )
    })
}

function updateUserVerification(user_id) {
    return new Promise ((resolve, reject) => {
        db.query(
            'UPDATE users SET Active = 1 WHERE user_id = ?',
            [user_id],
            function(err, result){
                if (err){
                    reject(err)
                } else {
                    console.log("User Email Verified")
                    resolve();
                }
            }
        )
    })
}

function deleteCrypt(user_id){
    db.query(
        'DELETE FROM verification WHERE user_id = ?',
        [user_id],
        function(err){
            if (err){
                throw err
            } else {
                console.log('user crypt removed')
                return;
            }
        }
    )
}
module.exports = router;