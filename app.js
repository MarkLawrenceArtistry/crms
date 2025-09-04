// express, app, db file
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // for initial account
const path = require('path'); // for reading path
const { db, initDB } = require('./database');


// other constants
const PORT = 3000
const app = express()
const patientRoutes = require('./routes/patients')
const medicineRoutes = require('./routes/medicines')
const authRoutes = require('./routes/auth')


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/patients', patientRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/auth', authRoutes);


// for creating initial/default account
function initAccounts() {
    const username = "admin"
    const password = "123"

    const query = `
        SELECT * FROM users
        WHERE username = ?
    `
    const params = [username]

    db.get(query, params, (err, row) => {
        if(err) {
            return console.error(err.message)
        }

        if(!row) {
            bcrypt.hash(password, 10, (err, hash) => {
                if(err) {
                    return console.error(err.message)
                }

                const insertQuery = `
                    INSERT INTO users (username, password_hash)
                    VALUES (?, ?)
                `

                db.run(insertQuery, [username, hash], function(err) {
                    if(err) {
                        return console.error(err.message)
                    }
                    console.log('DEFAULT ACCOUNT CREATED.')
                })
            })
        } else {
            console.log('DEFAULT ACCOUNT ALREADY EXISTS.')
        }
    })
}


initDB();
initAccounts();


app.listen(PORT, () => {
    console.log(`SERVER IS CURRENTLY OPEN AT http://localhost:${PORT} ....`)
})