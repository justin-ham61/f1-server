const express = require('express')
const cors = require('cors')
const app = express();
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const nodemailer = require("nodemailer");


const options = {
    host: '54.71.40.98',
    user: 'server',
    password: 'keyboardPass1.',
    database: 'f1'
};

const db = mysql.createPool(options);
const sessionStore = new MySQLStore(options);

app.use(session({
    secret: '1234',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: { secure: false }
    })  
);

app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'build1')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next()
    }   else {
        res.redirect("/")
    }
}

const isAdmin = (req, res, next) => {
    if(req.session.isAdmin){
        next()
    } else {
        res.redirect("/")
    }
}

app.get('/', async (req, res) => {
    let isAuth = req.session.isAuth;
    let user;
    if (req.session.isAuth){
        user = await getUserData(req.session.user_id)
    }
    res.render('Index2', {isAuth : isAuth, user : user});
})

app.get('/registration', (req, res) => {
    res.render('Registration');
})

app.get('/EmailConfirm', (req, res) => {
    res.render('EmailConfirm')
})


app.get('/login', (req, res) => {
    res.render('Login', {errorMessage : req.flash('login-error')});
})

app.get('/account', isAuth, (req, res) => {
    res.render('Account');
})

app.get('/leagues', isAuth, async (req, res) => {
    let isAuth = req.session.isAuth;
    let leagues = await getJoinedLeagues(req.session.user_id);
    res.render('LeagueIndex', {isAuth : isAuth, leagues : leagues})
})

app.get('/LeagueCreateForm', isAuth, (req,res) => {
    res.render('LeagueCreateForm')
})

app.get('/leagues/:leagueName', isAuth, async (req, res) => {
    let isAuth = req.session.isAuth;
    let name = req.session.name;
    let leagueName = req.params.leagueName;
    res.render('LeagueOverview', { name : name, isAuth : isAuth, leagueName : leagueName })
})

app.get('/BetInfo/:betCategory/:bet_id', isAuth, async (req,res) => {
    let bet_id = req.params.bet_id;
    let totalBets = 0; 
    let betAmount = 0;
    let betCategory = req.params.betCategory
    let drivers = {
        "Max Verstappen": 0,
        "Sergio Perez": 0,
        "Charles Leclerc": 0,
        "Carlos Sainz": 0,
        "George Russel": 0,
        "Lewis Hamilton": 0,
        "Esteban Ocon": 0,
        "Pierre Gasly": 0,
        "Oscar Piastri": 0,
        "Lando Norris": 0,
        "Valteri Bottas": 0,
        "Zhou Guanyu": 0,
        "Lance Stroll": 0,
        "Fernando Alonso": 0,
        "Kevin Magnussen": 0,
        "Nico Hulkenberg": 0,
        "Nick De Vries": 0,
        "Yuki Tsunoda": 0,
        "Alex Albon": 0,
        "Logan Sargeant": 0
    }
    let amount = {
        "Max Verstappen": 0,
        "Sergio Perez": 0,
        "Charles Leclerc": 0,
        "Carlos Sainz": 0,
        "George Russel": 0,
        "Lewis Hamilton": 0,
        "Esteban Ocon": 0,
        "Pierre Gasly": 0,
        "Oscar Piastri": 0,
        "Lando Norris": 0,
        "Valteri Bottas": 0,
        "Zhou Guanyu": 0,
        "Lance Stroll": 0,
        "Fernando Alonso": 0,
        "Kevin Magnussen": 0,
        "Nico Hulkenberg": 0,
        "Nick De Vries": 0,
        "Yuki Tsunoda": 0,
        "Alex Albon": 0,
        "Logan Sargeant": 0
    }
    let yesno = {
        "Yes": 0,
        "No": 0
    }
    let yesnoAmount = {
        "Yes": 0,
        "No": 0
    }
    let pitstops = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
    }
    let pitstopsAmount = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0
    }
    let stats = await getBetStats(bet_id);
    if (stats.length > 0){
        if (betCategory == "Placement" || betCategory == "Qualification"){
            betCategory = "drivers"
            stats.forEach((bet) => {
                let key = bet.BetChoice;
                totalBets += 1; 
                drivers[key] += 1;
                amount[key] += bet.BetAmount;
                betAmount += bet.BetAmount;
            })
        } else if (betCategory == "5050") {
            betCategory = "yesno"
            stats.forEach((bet) => {
                let key = bet.BetChoice;
                totalBets += 1;
                yesno[key] += 1;
                yesnoAmount[key] += bet.BetAmount;
                betAmount += bet.BetAmount
            })
        } else if (betCategory == "Pitstops") {
            betCategory = "pitstops"
            stats.forEach((bet) => {
                let key = bet.BetChoice;
                totalBets += 1;
                pitstops[key] += 1;
                pitstopsAmount[key] += bet.BetAmount;
                betAmount += bet.BetAmount
            })
        }
    }

    res.render('BetInfo', {
        isAuth : req.session.isAuth,
        drivers : drivers,
        amount : amount,
        totalBets : totalBets,
        betAmount : betAmount,
        yesno : yesno,
        yesnoAmount : yesnoAmount,
        betCategory : betCategory,
        pitstops : pitstops,
        pitstopsAmount : pitstopsAmount
    })
})

app.get('/bets/:betCategory', isAuth, async (req,res) => {
    let betCategory = req.params.betCategory
    let bets = await getBets(betCategory);
    let userBets = await getUserBets(req.session.user_id)
    let userData = await getUserData(req.session.user_id)
    let result = userBets.filter((element1) => {
        return bets.some((element2) => {
            return element1.bet_id === element2.bet_id; // return the ones with equal id
       });
    });
    let placedBets =[];
    result.forEach(element => {
        placedBets.push(element.bet_id)
    })
    res.render(`${betCategory}`, {isAuth : req.session.isAuth, bets : bets, userBets : userBets, placedBets : placedBets, result : result, errorMessage : req.flash('error'), successMessage : req.flash('success'), balance : userData[0].Balance})
})

app.get('/UserInfo/:user_id', isAuth, async (req, res) => {
    let userData = await getUserData(req.params.user_id)
    let userBets = await getUserBets(req.params.user_id)
    let placedBets = await getPlacedBets(req.params.user_id)
    let completeBets = []
    for (let i = 0; i < userBets.length; i++){
        let data = {
            "BetName": `${placedBets[i].BetName}`,
            "BetAmount": `${userBets[i].BetAmount}`,
            "BetChoice": `${userBets[i].BetChoice}`
        }
        completeBets.push(data)
    }
    console.log(completeBets)
    res.render('UserInfo', {isAuth : req.session.isAuth, bets : completeBets, user : userData})
})

app.get('/admin', isAdmin, (req, res) => {
    console.log(req.session.isAdmin)
    res.render('Admin')
})
app.get('/apitest', isAuth, (req, res) => {
    res.render('apitest')
})

app.post('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/');
    })
})



app.listen(8080, () => {
    console.log("server is running on port 8000");
})

const leagueRouter = require('./routes/Leagues.js');
const userRouter = require('./routes/UserAuth.js');
const betRouter = require('./routes/Bets.js')
const adminRouter = require('./routes/Admin.js');
const { getEnabledCategories } = require('trace_events');
app.use('/UserAuth', userRouter);
app.use('/Leagues', leagueRouter);
app.use('/Bets', betRouter);
app.use('/Admin',adminRouter)

function getJoinedLeagues(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT leagues.league_id, LeagueName FROM leagues INNER JOIN userleagues ON leagues.league_id = userleagues.league_id WHERE user_id = ?;',
            [user_id],
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

function getPlacedBets(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT bets.BetName FROM bets INNER JOIN userbets ON bets.bet_id = userbets.bet_id WHERE user_id = ?;',
            [user_id],
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

function getUserBets(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM userbets WHERE user_id = ?;',
            [user_id],
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

function getBetStats(bet_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM userbets WHERE bet_id = ?',
            [bet_id],
            function (err, result){
                if(err){
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

function getUserData(user_id){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM users WHERE user_id = ?',
            [user_id],
            function (err, result){
                if(err){
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}