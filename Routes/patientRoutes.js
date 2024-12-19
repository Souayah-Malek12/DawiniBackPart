
const express = require("express");
const { PasserRendezVousController } = require("../Controller/RdvController");
const router = express.Router();


router.post('/:patientId/:doctorId', PasserRendezVousController)


module.exports = router;
