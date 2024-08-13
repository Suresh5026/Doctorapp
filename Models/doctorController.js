const express = require('express');
const router  =  express.Router();
const userModel = require('./userModel');
const doctorModel = require('./doctorModel');
const validateToken = require('../Middlewares/validateToken');
const admin = require('../Middlewares/admin');

router.post('/create-doctor',validateToken,admin, async(req,res)=>{
    try{
        const doctor = await doctorModel.create(req.body);
        return res.status(201).json({ message : 'Doctor created successfully', doctor })

    }catch (error){
        return res.status(500).json({ message: error.message });
    }
} )

router.get('/getDoctor',async(req,res)=>{
    try{
        const doctor = await doctorModel.find();
        return res.json({
            data: doctor,
            message: "Doctor details Fetched Successfully",
        })
    }catch (error){
        return res.status(500).json({ message: error.message });
    }
})

router.get('/getDoctor/:doctorID', async (req, res) => {
    try {
        const { doctorID } = req.params; 
        const doctor = await doctorModel.findById(doctorID); 
        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found",
            });
        }

        return res.json({
            data: doctor,
            message: "Doctor details fetched successfully",
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

module.exports = router;