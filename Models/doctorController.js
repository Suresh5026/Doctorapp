const express = require('express');
const router  =  express.Router();
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

router.get('/getDoctorByEmail/:email',  async (req, res) => {
    try {
      const { email } = req.params;
      const doctor = await doctorModel.findOne({ email });
  
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
  
      res.json({ doctorId: doctor._id });
    } catch (error) {
      console.error('Error fetching doctor by email:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.put('/update-doctor/:doctorID', validateToken, admin, async (req, res) => {
    try {
        const { doctorID } = req.params;
        const updates = req.body;

        
        const doctor = await doctorModel.findById(doctorID);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        
        const updatedDoctor = await doctorModel.findByIdAndUpdate(doctorID, updates, { new: true });

        return res.json({
            message: "Doctor details updated successfully",
            doctor: updatedDoctor,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


module.exports = router;