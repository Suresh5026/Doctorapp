const express =require('express');
const router = express.Router();
const userModel = require('../Models/userModel');
const doctorModel = require('../Models/doctorModel');
const validateToken = require('../Middlewares/validateToken');
const isAdmin = require('../Middlewares/admin');

router.put('/approveDoctor/:doctorId',validateToken,async(req,res)=>{
    try {
        const doctorId = req.params.doctorId;
  
        // Update doctor's status to "Approved"
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
          return res.status(404).json({ message: 'Doctor not found' });
        }
  
        doctor.status = 'Approved';
        await doctor.save();
  
        // Update user's status to "Doctor"
        const user = await userModel.findOne({ email: doctor.email }); // Assuming email is the linking field
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        user.status = 'Doctor';
        await user.save();
  
        res.status(200).json({ message: 'Doctor and User status updated successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
})

module.exports = router;