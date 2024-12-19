const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./Config/db');

dotenv.config();
const app= express();

const port = process.env.PORT;

app.use(express.json());


connectDB();
app.listen(port, ()=>{
    console.log(`Connected to server on port :${port}`);

})

app.get('/', (req, res)=>{
    res.send("Welcome to dewini");
})

app.use('/Dawini/auth', require('./Routes/authRoutes'));

app.use('/Dawini/adm', require('./Routes/adminRoutes'));

app.use('/Dawini/doc', require('./Routes/doctorsRoutes'));