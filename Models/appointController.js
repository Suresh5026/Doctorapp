const express = require("express");
const router = express.Router();
const appointModel = require("./appointModel");
const doctorModel = require("./doctorModel");
const userModel = require("./userModel");
const validateToken = require("../Middlewares/validateToken");
router.post("/createAppointment", async (req, res) => {
  try {
    const { doctorId, patientId, date, bookfromtime, booktotime } = req.body;
    const doctor = await doctorModel.findById(doctorId);
    const patient = await userModel.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or Patient not found" });
    }
    const existingAppointment = await appointModel.findOne({
      doctor: doctorId,
      date,
      $or: [
        { bookfromtime: { $lt: booktotime, $gt: bookfromtime } },
        { booktotime: { $gt: bookfromtime, $lt: booktotime } },
      ],
    });
    if (existingAppointment) {
      return res.status(400).json({ message: "Time slot already booked" });
    }
    const newAppointment = new appointModel({
      doctor: doctorId,
      doctorName: `${doctor.firstname} ${doctor.lastname}`,
      doctorFees: doctor.fees,
      patient: patientId,
      patientName: patient.name,
      date,
      bookfromtime,
      booktotime,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getappointment/:patientId",validateToken, async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const appointments = await appointModel.find({ patient: patientId });
    if (!appointments) {
      return res
        .status(404)
        .json({ message: "No appointments found for this patient" });
    }
    res
      .status(200)
      .json({ appointments, message: "Appointments Fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteBooking/:appointmentId", async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const result = await appointModel.findByIdAndDelete(appointmentId);
    if (!result) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/getAppointmentsByDoctor/:doctorId', async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      const appointments = await appointModel.find({ doctor: doctorId });
      res.json({ data: appointments });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  router.get('/getBookedSlots', async (req, res) => {
    const { doctorId, date } = req.query;
  
    try {
      const appointments = await appointModel.find({
        doctorId,
        date,
      });
  
      const bookedSlots = appointments.reduce((acc, appointment) => {
        acc[`${appointment.bookfromtime}-${appointment.booktotime}`] = true;
        return acc;
      }, {});
  
      res.status(200).json({ bookedSlots });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  

  
  router.put('/approveBooking/:doctorId', async (req, res) => {
    try {
      const { appointmentId, status } = req.body;
      const updatedAppointment = await appointModel.findByIdAndUpdate(
        appointmentId,
        { status },
        { new: true }
      );
      res.json({ data: updatedAppointment });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;
