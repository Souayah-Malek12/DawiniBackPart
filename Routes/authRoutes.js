const express = require("express");
const { loginController, registreController } = require("../Controller/authController");

const router = express.Router() 

router.post('/login', loginController)
router.post('/registre', registreController);


module.exports = router;