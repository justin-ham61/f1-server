const express = require('express');
const router = express.Router();
let mysql = require('mysql');
const bcrypt = require('bcrypt');


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
    if (req.body.firstName = "Grace"){
        job = "Team Principle"
    }
    
    let emailresult = await checkEmail(email)

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
                            res.redirect('/login')
                            return;
                        }
                    }
                )
            }
        })
    }
})

router.post('/loginUser', async (req, res) => {
    let {email, password} = req.body;
    let err = {email: 0}
    let userData = await checkEmail(email);
    if (userData.length == 0){
        err.email = 1;
    }
    if (err.email == 1){
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

module.exports = router;