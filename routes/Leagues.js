const { rejects } = require('assert');
const e = require('express');
const express = require('express');
const router = express.Router();
let mysql = require('mysql');

const app = express();
const path = require('path');

let db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(function(err){
    if(err) {
        return console.error('error: ' + err.message);
    }
})

router.post('/CreateLeague', async (req, res) => {
    let league_id = await getLeague(req.body.LeagueName);
    if (league_id.length > 0){
        res.redirect('/LeagueCreateForm')
    } else {
        let values = [req.body.LeagueName, req.body.LeaguePassword];
        await createLeague(values);
        let league_id = await getLeague(req.body.LeagueName)
        let ids = [req.session.user_id, league_id[0].league_id]
        await addUserToLeague(ids);
        res.redirect('/leagues')
    }
})

router.get('/FetchLeagues', async (req, res) => {
    let user_id = req.session.user_id;
    let joinedLeagues_id = await fetchLeagueId(user_id)
})

router.post('/LeagueInfo', async (req, res) => {
    req.session.name = await getLeagueMembers(req.body.leagueId);
    res.redirect(`/leagues/${req.body.leagueName}`)
})

router.post('/SearchLeague', async (req, res) => {
    let leagueName = req.body.leagueName;
    let result = await checkLeague(leagueName);
    if (result.length == 0){
        res.send(false)
    } else {
        res.send(result)
    }
})

router.post('/JoinLeague', async (req, res) => {
    let league = req.body.leagueResult;
    let leagueId = league.league_id
    let leagueUserCheck = await leagueCheck(req.session.user_id, leagueId);
    if (leagueUserCheck.length == 0){
        let ids = [req.session.user_id, leagueId]
        await addUserToLeague(ids);
        res.redirect('/leagues')  
    } else {
        res.send(false)
    }
})

function leagueCheck(user_id, league_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM userleagues WHERE user_id = ? AND league_id = ?;',
            [[user_id], [league_id]],
            function(err, result){
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        )
    })
}

function getLeagueMembers(leagueId){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT users.user_id, FirstName, LastName, Balance, Job FROM users INNER JOIN userleagues ON users.user_id = userleagues.user_id WHERE league_id = ?;',
            leagueId,
            function(err, result){
                if (err){
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        )
    })
}

function getLeague(name){
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT league_id FROM leagues WHERE LeagueName = ?',
            name,
            function (err, result){
                if (err){
                    reject(err)
                } else {
                    resolve(result);
                }
            }   
        )
    })
}

function createLeague(values){
    return new Promise ((resolve, reject) => {
        db.query(
            'INSERT INTO leagues (LeagueName, LeaguePassword) VALUES (?);',
            [values],
            function (err, result){
                if (err) {
                    reject(err); 
                } else {
                    console.log('data has been entered')
                    resolve();
                }
            }
        )
    })
}

function addUserToLeague(values){
    return new Promise ((resolve, reject) => {
        db.query(
            'INSERT INTO userleagues (user_id, league_id) VALUES (?);',
            [values],
            function (err, result) {
                if(err){
                    reject(err);
                } else {
                    resolve()
                }
            }
        )
    })
}

function fetchLeagueId(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT league_id FROM userleagues WHERE user_id = ?;',
            user_id,
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

function checkLeague(leagueName){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM leagues WHERE LeagueName = ?;',
            [leagueName],
            function(err, result){
                if (err){
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}
module.exports = router;