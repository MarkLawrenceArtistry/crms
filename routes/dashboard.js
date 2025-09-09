const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')

router.get('/stats', dashboardController.getStatistics)
router.get('/consultations-by-month', dashboardController.getConsultationsByMonth)

module.exports = router