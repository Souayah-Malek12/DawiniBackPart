const express = require("express");
const { acceptDocteur } = require("../Controller/adminController");

const router = express.Router();

router.put('/:accId', acceptDocteur)


module.exports = router;