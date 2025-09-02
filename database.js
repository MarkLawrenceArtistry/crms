const sqlite3 = require('sqlite3').verbose()
const DBSOURCE = './clinic.db'

// FOR CREATING DB
const db = new sqlite3.Database(DBSOURCE, (err) => {
    if(err) {
        console.log(err.message)
        throw err
    } else {
        console.log("CONNECTED TO THE DATABASE...")
    }
})

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

        const consultationsQuery = `
            CREATE TABLE IF NOT EXISTS consultations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                complaint TEXT NOT NULL,
                diagnosis TEXT,
                treatment TEXT,
                consultation_date TEXT NOT NULL,
                FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
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

        // ------------------------------------------------------------ //

        db.run(patientsQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING PATIENTS TABLE: ', err.message)
            } else {
                console.log('PATIENTS TABLE CREATED/EXISTS.')
            }
        });

        db.run(consultationsQuery, (err) => {
            if(err) {
                console.error('ERROR CREATING CONSULTATIONS TABLE: ', err.message)
            } else {
                console.log('CONSULTATIONS TABLE CREATED/EXISTS.')
            }
        })

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
    })
}

module.exports = { db, initDB }