const { rejects } = require('assert');
const e = require('express');
const express = require('express');
const router = express.Router();
let mysql = require('mysql');
const schedule = require('node-schedule');
const { route, lock } = require('./Leagues');
var { lockTime, matterRace } = require('./../public/constants/const.js')

var isLockedRace = false; 
var isLockedQuali = false;
var qualiDate;
var raceDate;
var roundNumber;

function toggleIsLockedRace(){
    isLockedRace = true; 
    console.log(isLockedRace)

}

function toggleIsLockedQuali(){
    isLockedQuali = true
    lockTime.time = raceDate;
    lockTime.category = "Race"
    console.log(isLockedQuali)
}

async function updateRaceDate(){
    let dates = await getRaceDate();

    dates = dates.MRData.RaceTable.Races //gets the dates for all the races 

    const time = new Date(new Date().toISOString().split('T')[0]) //calls today's date

    for (let i = 0; i < dates.length; i++){

        let fullDate = new Date(dates[i].date + 'T' + dates[i].time); //formats the racedate to have day and the time

        let qualiFullDate = new Date(dates[i].Qualifying.date + 'T' + dates[i].Qualifying.time) //formats the qualidate to have the day and the time

        if (time < fullDate){

            console.log('Race will happen in the future at Round: ' + (i + 1))
            raceDate = fullDate;
            qualiDate = qualiFullDate;
            roundNumber = i + 1
            lockTime.time = qualiDate;
            lockTime.category = "Qualification"
            console.log(raceDate, qualiDate, roundNumber, lockTime)
            //i have the location of the next race, previous race location is just i - 1
            matterRace.nextRace.round = roundNumber;
            matterRace.nextRace.date = dates[i].date;
            matterRace.nextRace.name = dates[i].raceName;
            matterRace.nextRace.race = dates[i].Circuit.circuitId
            matterRace.previousRace.round = roundNumber - 1;
            matterRace.previousRace.date = dates[i-1].date;
            matterRace.previousRace.name = dates[i-1].raceName;
            matterRace.previousRace.race = dates[i-1].Circuit.circuitId

            console.log(dates)
            break;

        }
    }
}

async function getRaceDate(){
    let raceDateResult = await fetch('http://ergast.com/api/f1/current.json', {
        method: 'GET',
    })
    .then((response) => response.json())
    .then((data) => {
        return(data)
    })
    return raceDateResult;
}

const toggleQuali = schedule.scheduleJob(qualiDate, toggleIsLockedQuali)
const toggleRace = schedule.scheduleJob(raceDate, toggleIsLockedRace)
const updateRace = schedule.scheduleJob("1 1 * * 1", updateRaceDate )

let db = mysql.createConnection({
    host: '54.71.40.98',
    user: 'server',
    password: 'keyboardPass1.',
    database: 'f1'
});

router.post('/BetInfo', async (req, res) => {
    res.redirect(`/BetInfo/${req.body.betCategory}/${req.body.bet_id}`)
})

router.post('/testDate', async (req,res) => {
    updateRaceDate();
    res.redirect('/admin')
})

router.post('/PlaceBet/:bet_id/:betCategory', async (req, res) => {
    //check if user already bet on this bet
    if (isLockedQuali && req.params.betCategory == "Qualification"){
        req.flash('error', 'Qualification Bets Are Locked')
        res.redirect(`/bets/${req.params.betCategory}`)
    } else if (isLockedRace && (req.params.betCategory == "Placement") || (req.params.betCategory == "5050") || (req.params.betCategory == "Pitstops")){
        req.flash('error', 'Race Bets Are Locked')
        res.redirect(`/bets/${req.params.betCategory}`)
    } else {
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
        res.redirect(`/bets/${req.params.betCategory}`)
    }
})
 
router.post('/DistributeWinnings', async (req, res) => {
    let betCategory = req.body.category
    let year = req.body.year
    let round = req.body.round
    if (betCategory == "Placement"){
        var result = await fetch(`https://ergast.com/api/f1/${year}/${round}/results.json`, {
        method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            return(data)
        })
        var driverArray = createResultArray(result)
    } else if (betCategory == "Qualification"){
        var result = await fetch(`https://ergast.com/api/f1/${year}/${round}/qualifying.json`, {
        method: "GET",
        })
        .then((response) => response.json())
        .then((data) => {
            return(data)
        })
        var driverArray = createQualiResultArray(result)
    }
    let bets = await getBets(betCategory)
    console.log(bets)
    console.log(driverArray)
    for(let i = 0; i < bets.length; i++){
        let userBets = await getUserBets(bets[i].bet_id)
        let winningChoice = driverArray[i]
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
                let amountGain = (distributionPercent * totalPool).toFixed(2);
                updateUserBalance(element.user_id, amountGain);
                console.log("Total Pool for " + (i+1) + " Place: " + totalPool)
                console.log("User: " + element.user_id + " Amount Gain: $" + amountGain + " % of winning pool: " + (distributionPercent*100) + "%")
            }
        })
    }
    res.redirect('/admin')
})

router.post('/UnlockBets', (req, res) => {
    isLockedRace = false;
    isLockedQuali = false; 
    console.log(isLockedQuali)
    console.log(isLockedRace)
    res.redirect('/admin')
})

router.post('/ClearBets', (req, res) => {
    db.query(
        'TRUNCATE userbets;',
        function (err){
            if (err){
                throw err;
            } else {
                console.log('deleted all userbets')
            }
        }
    )
    res.redirect('/admin')
})


router.post('/AddBet', (req, res) => {
    let betName = req.body.betName;
    let category = req.body.category;
    addBet(betName, category);
    res.redirect('/admin')
})

db.connect(function(err){
    if(err) {
        return console.error('error: ' + err.message);
    }
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

function getBets(betCategory){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM bets WHERE Category = ?',
            [betCategory],
            function(err, result){
                if(err){
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
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

function addBet(betName, category){
    db.query(
        'INSERT INTO bets (BetName, Category) VALUES (?, ?);',
        [[betName], [category]],
        function (err){
            if (err){
                throw err;
            } else {
                console.log('added bet')
                return;
            }
        }
    )
}

function createResultArray(data){
    let driverArray = []
    let raceResults = data.MRData.RaceTable.Races[0].Results;
    raceResults.forEach((result) => {
        let driverFullName = result.Driver.givenName + ' ' + result.Driver.familyName
        driverArray.push(driverFullName);
    });
    return(driverArray);
}

function createQualiResultArray(data){
    let driverArray = []
    let raceResults = data.MRData.RaceTable.Races[0].QualifyingResults;
    raceResults.forEach((result) => {
        let driverFullName = result.Driver.givenName + ' ' + result.Driver.familyName
        driverArray.push(driverFullName);
    });
    return(driverArray);
}


module.exports = router;