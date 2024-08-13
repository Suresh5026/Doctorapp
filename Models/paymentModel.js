const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      default: "Booked",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: Map,
      of: String,
    },
    paymentId: { type: String, required: false },
    paymentStatus: { type: String, required: false },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
