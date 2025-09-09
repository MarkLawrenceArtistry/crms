const { db } = require('../database')

const getStatistics = (req, res) => {
    const queries = [
        db.get("SELECT COUNT(*) as count FROM patients"),
        db.get("SELECT COUNT(*) as count FROM consultations"),
        db.get("SELECT COUNT(*) as count FROM medicines"),
        db.get("SELECT COUNT(*) as count FROM medicines WHERE quantity < 10"),
    ]
    
    Promise.all(queries).then(results => {
        res.status(200).json({success:true,data:{
            totalPatients: results[0].count,
            totalConsultations: results[1].count,
            totalMedicines: results[2].count,
            lowStockMedicines: results[3].count
        }})
    }).catch(err => {
        res.status(500).json({success:false,data:err.message})
    })
}

const getConsultationsByMonth = (req, res) => {
    const query = `
        SELECT strftime('%Y-%m', consultation_date) as month, COUNT(id) as count
        FROM consultations
        WHERE consultation_date >= strftime('%Y-%m-%d %H:%M:%S', date('now', '-12 months'))
        GROUP BY month
        ORDER BY month;
    `

    db.all(query, [], (err, rows) => {
        if(err) {
            return res.status(500).json({success:false,data:err.message})
        }
        res.status(200).json({success:true,data:rows})
    })
}

module.exports = { getStatistics, getConsultationsByMonth }