const express = require("express");
const { getAccepteddoctorsAcc, getUnAccepteddoctorsAcc, getDoctorById, getDoctorBySpecialty, getDoctorsByGeoParams } = require("../Controller/doctorController");

const router = express.Router();

router.get('/', getAccepteddoctorsAcc)
router.get('/Ndoct', getUnAccepteddoctorsAcc)
router.get('/:docId', getDoctorById)
router.get('/specialty/:spec', getDoctorBySpecialty)

router.get('/', getDoctorsByGeoParams);



module.exports = router;