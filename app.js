// express, app, db file
const express = require('express')
const cors = require('cors')
const { db, initDB } = require('./database')


// other constants
const PORT = 3000
const app = express()
const patientRoutes = require('./routes/patients')
const medicineRoutes = require('./routes/medicines')
const authRoutes = require('./routes/auth')


// middlewares
app.use(express.json())
app.use(cors())
app.use(express.static('public'))
app.use('/api/patients', patientRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/auth', authRoutes);


initDB();


app.get('/', (req, res) => {
    return res.status(200).json({success:true,data:"Welcome"})
})

app.listen(PORT, () => {
    console.log(`SERVER IS CURRENTLY OPEN AT http://localhost:${PORT} ....`)
})