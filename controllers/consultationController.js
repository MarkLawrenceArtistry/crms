const { db } = require('../database')

// for POST
const addConsultation = (req, res) => {
    const { patient_id } = req.params
    const { complaint, diagnosis, treatment, consultation_date } = req.body

    if(!complaint || !consultation_date) {
        return res.status(400).json({success:false,data:"Both complaint and consultation date data are required."})
    }

    const query = `
        INSERT INTO consultations (patient_id, complaint, diagnosis, treatment, consultation_date)
        VALUES (?, ?, ?, ?, ?)
    `
    const params = [patient_id, complaint, diagnosis, treatment, consultation_date]

    db.run(query, params, function(err) {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }

        res.status(201).json({success:true,json:{
            consultation_id: this.lastID,
            complaint: complaint,
            diagnosis: diagnosis,
            treatment: treatment,
            consultation_date: consultation_date
        }})
    })
}

// for GET (all consultations from a patient)
const getAllConsultation = (req, res) => {
    const { patient_id } = req.params

    const query = "SELECT * FROM consultations WHERE patient_id = ?"
    const params = [patient_id]

    db.all(query, params, (err, rows) => {
        if(err){
            return res.status(400).json({success:false,data:err.message})
        }

        res.status(200).json({success:true,data:rows})
    })
}

module.exports = { addConsultation, getAllConsultation }