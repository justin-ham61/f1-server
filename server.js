const express = require('express')
const cors = require('cors')
const app = express();
const path = require('path');
const mysql = require('mysql')
const bodyParser = require('body-parser')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const flash = require('connect-flash');


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

app.get('/', (req, res) => {
    let isAuth = req.session.isAuth;
    res.render('Index2', {isAuth : isAuth});
})

app.get('/registration', (req, res) => {
    res.render('registration');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/account', isAuth, (req, res) => {
    res.render('account');
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

app.get('/BetInfo/:bet_id', isAuth, async (req,res) => {
    let bet_id = req.params.bet_id;
    let totalBets = 0; 
    let betAmount = 0;
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
    let stats = await getBetStats(bet_id);
    if (stats.length > 0){
        stats.forEach((bet) => {
            let key = bet.BetChoice;
            totalBets += 1; 
            drivers[key] += 1;
            amount[key] += bet.BetAmount;
            betAmount += bet.BetAmount;
        })
    }
    console.log(drivers)
    console.log(betAmount)
    res.render('BetInfo', {isAuth : req.session.isAuth, drivers : drivers, amount : amount, totalBets : totalBets, betAmount : betAmount})
})

app.get('/bets', isAuth, async (req,res) => {
    let bets = await getBets();
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

    res.render('Bets', {isAuth : req.session.isAuth, bets : bets, userBets : userBets, placedBets : placedBets, result : result, message : req.flash('error'), balance : userData[0].Balance})
})

app.get('/sessiontest', (req, res) => {
    console.log(req.session.firstName);
    //res.sendFile(path.join(__dirname, 'build1', 'index.html'));
})

app.post('/logout', (req,res) => {
    req.session.destroy((err) => {
        if(err) throw err;
        res.redirect('/');
    })
})

app.listen(8002, () => {
    console.log("server is running on port 8000");
})

const leagueRouter = require('./routes/Leagues.js');
const userRouter = require('./routes/UserAuth.js');
const betRouter = require('./routes/Bets.js')
const { getEnabledCategories } = require('trace_events');
app.use('/UserAuth', userRouter);
app.use('/Leagues', leagueRouter);
app.use('/Bets', betRouter);

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

function getBets(){
    return new Promise ((resolve, reject) => {
        db.query(
            'SELECT * FROM bets',
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