const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron')
const fs = require('fs')
let dbPath
let db

// FOR FETCHING DB
try {
    // PRODUCTION
    const { app } = require('electron')
    dbPath = path.join(app.getPath('userData'), 'clinic.db')

    const dbDir = path.dirname(dbPath)
    if(!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true })
    }

} catch(err) {
    // DEVELOPMENT
    console.log('FETCHING LOCAL DATABASE')
    dbPath = path.join(__dirname, 'clinic.db')
}

// FOR CONNECTING TO DB
const connectDB = () => {
    return new sqlite3.Database(dbPath, (err) => {
        if(err) {
            console.err(err.message)
        } else {
            console.log("CONNECTED TO THE DATABASE")
        }
    })
}

db = connectDB()

// FOR CREATING TABLES IN DB
const initDB = () => {
    db.serialize(() => {
        console.log('INITILIAZING DATABASE..');

        const patientsQuery = `
            CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                dob TEXT NOT NULL,
                address TEXT
            )
        `;

        const medicinesQuery = `
            CREATE TABLE IF NOT EXISTS medicines (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                quantity INTEGER NOT NULL DEFAULT 0,
                description TEXT
            )
        `;

        const usersQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL
            )
        `;

        const appointmentsQuery = `
            CREATE TABLE IF NOT EXISTS appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                appointment_datetime TEXT NOT NULL,
                status TEXT NOT NULL,
                reason TEXT,
                notes TEXT,
                FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
            )
        `

        // ------------------------------------------------------------ //

        db.run(patientsQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING PATIENTS TABLE: ', err.message)
            } else {
                console.log('PATIENTS TABLE CREATED/EXISTS.')
            }
        });

        db.run(medicinesQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING MEDICINES TABLE: ', err.message)
            } else {
                console.log('MEDICINES TABLE CREATED/EXISTS.')
            }
        })

        db.run(usersQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING USERS TABLE: ', err.message)
            } else {
                console.log('USERS TABLE CREATED/EXISTS.')
            }
        })

        db.run(appointmentsQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING APPOINTMENTS TABLE: ', err.message)
            } else {
                console.log('APPOINTMENTS TABLE CREATED/EXISTS.')
            }
        })
    })
}

module.exports = { db, initDB }