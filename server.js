const express = require('express')
const cors = require('cors')
const mysql = require('mysql')

const app = express();

app.use(cors());
app.use(express.json());

const options = {
    host: 'localhost',
    user: 'root',
    password: 'Blue4524.',
    database: 'f1bets'
}

const db = mysql.createPool(options);

app.get('/', (req, res) => {
    db.query(
        'SELECT * FROM tester',
        function (err, result){
            if (err){
                throw err;
            } else {
                console.log(result)
            }
        }
    )
    res.json({ message: "Hello from server!" })
})

app.listen(8000, () => {
    console.log("server is running on port 8000")
})