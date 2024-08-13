const mongoose = require("mongoose");

const appSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      required: true,
    },
    doctorName: {
      type: String,
      required: true,
    },
    doctorFees: {
      type: Number,
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    patientName: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bookfromtime: {
      type: String,
      required: true,
    },
    booktotime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
      required :  true
    },
  },
  { timestamps: true }
);

const appointModel = mongoose.model("appointment", appSchema);
module.exports = appointModel;
