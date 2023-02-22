const { rejects } = require('assert');
const e = require('express');
const express = require('express');
const router = express.Router();
let mysql = require('mysql');
const flash = require('connect-flash');


let db = mysql.createConnection({
    host: '54.71.40.98',
    user: 'server',
    password: 'keyboardPass1.',
    database: 'f1'
});

router.post('/BetInfo', async (req, res) => {
    res.redirect(`/BetInfo/${req.body.bet_id}`)
})

router.post('/PlaceBet/:bet_id', async (req, res) => {
    //check if user already bet on this bet
    let betCheck = await checkUserBet(req.params.bet_id, req.session.user_id)
    if (betCheck.length > 0){
        console.log('bet already placed')
        req.flash('error', 'Unable to Place Bet: Bet Already Placed')
    } else {
        //Fetch current users balance
        let balance = await getBalance(req.session.user_id);
        let remainingBalance = (balance - req.body.betAmount)
        if (remainingBalance >= 0 ){
            let value1 = [req.params.bet_id, req.session.user_id, req.body.betAmount, req.body.driver];
            placeBet(value1, remainingBalance, req.session.user_id);
            req.flash('success', "Successfully Placed Bet")
        } else {
            console.log('not enough funds')
            req.flash('error', 'Unable to Place Bet: Not Enough Funds')
        }
        
    }
    res.redirect('/bets')
})
 
router.post('/DistributeWinnings', async (req, res) => {
    let winningChoice = req.body.winningChoice;
    let bet_id = req.body.bet_id;
    let userBets = await getUserBets(bet_id);
    let totalPool = 0;
    let correctBetPool = 0;
    userBets.forEach((element) => {
        totalPool += element.BetAmount;
        if (element.BetChoice === winningChoice){
            correctBetPool += element.BetAmount;
        }
    })
    userBets.forEach((element) => {
        if (element.BetChoice === winningChoice){
            let distributionPercent = (element.BetAmount/correctBetPool);
            let amountGain = (distributionPercent * totalPool);
            updateUserBalance(element.user_id, amountGain);
            clearBets();
            console.log(amountGain)
        }
    })
    res.redirect('/admin')
})

db.connect(function(err){
    if(err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySql server.');
})

function placeBet(value1, remainingBalance, user_id){
    db.query(
        'INSERT INTO userbets (bet_id, user_id, BetAmount, BetChoice) VALUES (?);',
        [value1],
        function(err){
            if (err){
                throw err;
            } else {
                return;
            }
        }
    )
    db.query(
        'UPDATE users SET Balance = ? WHERE user_id = ?',
        [remainingBalance, user_id],
        function(err){
            if (err){
                throw err;
            } else {
                return
            }
        }
    )
}

function checkUserBet(bet_id, user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM userbets WHERE bet_id = ? AND user_id = ?',
            [[bet_id], [user_id]],
            function(err, result){
                if(err){
                    reject(err);
                } else {
                    resolve(result);
                }
            }
        )
    })
}

function getBalance(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE user_id = ?;',
            [user_id],
            function(err, result){
                if (err){
                    reject(err)
                } else {
                    resolve(result[0].Balance)
                }
            }
        )
    })
}

function getUserBets(bet_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM userbets WHERE bet_id = ?;',
            [bet_id],
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

function updateUserBalance(user_id, amountGain){
    db.query(
        'UPDATE users SET Balance = Balance + ? WHERE user_id = ?;',
        [amountGain, user_id],
        function(err){
            if (err){
                throw err;
            } else {
                console.log('successfully updated Balance')
                return;
            }
        }
    )
}

function clearBets(){
    db.query(
        'TRUNCATE userbets;',
        function(err){
            if(err){
                throw err;
            } else {
                return;
            }
        }
    )
}

module.exports = router;