const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const {connectMongodb} = require('./Database/db');
const PORT = 8000;
const HOSTNAME = 'localhost';

const app = express();
connectMongodb();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

app.use('/user',require('./Models/userController'));
app.use('/doctor', require('./Models/doctorController'));
app.use('/approve',require('./Models/approveController'));
app.use('/appoint',require('./Models/appointController'));
app.use('/pay',require('./Models/paymentController'));
app.get("/",(req,res)=>{
    res.send("Server running success!!!")
});

app.listen(PORT,HOSTNAME,()=>{
    console.log(`Server is running on PORT ${PORT}`);
}
)