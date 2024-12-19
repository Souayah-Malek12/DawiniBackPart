const express = require("express");
const { acceptDocteur } = require("../Controller/adminController");
const { deleteDoctorControllerById } = require("../Controller/doctorController");

const router = express.Router();

router.put('/:accId', acceptDocteur)
router.delete('/:docId', deleteDoctorControllerById)


module.exports = router;