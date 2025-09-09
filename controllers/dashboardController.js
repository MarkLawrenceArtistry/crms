const { db } = require('../database')

const getStatistics = (req, res) => {
    const getAsync = (query, params = []) => {
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if(err) {
                    reject(err)
                } else {
                    resolve(row)
                }
            })
        })
    }


    const promises = [
        getAsync("SELECT COUNT(*) as count FROM patients"),
        getAsync("SELECT COUNT(*) as count FROM consultations"),
        getAsync("SELECT COUNT(*) as count FROM medicines"),
        getAsync("SELECT COUNT(*) as count FROM medicines WHERE quantity < 10"),
    ]
    
    Promise.all(promises).then(results => {
        res.status(200).json({
            success:true,
            data: {
                totalPatients: results[0].count,
                totalConsultations: results[1].count,
                totalMedicines: results[2].count,
                lowStockMedicines: results[3].count
            }
        })
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