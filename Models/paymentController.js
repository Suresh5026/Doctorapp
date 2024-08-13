const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const paymentModel = require("./paymentModel");
const crypto = require("crypto");
const appointModel = require("./appointModel");

let instance = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});

router.post("/orders", async (req, res) => {
  try {
    const { userId, amount, appointmentId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      notes: {
        userId: userId,
        appointmentId: appointmentId,
      },
    };

    console.log(options);

    // Create the Razorpay order
    instance.orders.create(options, async (err, order) => {
      if (err) {
        return res.status(500).json({ message: "Server Error", error: err });
      }

      const newOrder = new paymentModel({
        orderId: order.id,
        userId: userId,
        appointmentId: appointmentId,
        amount: order.amount,
        currency: order.currency,
        notes: order.notes,
      });

      await newOrder.save();
      return res.status(200).json({
        data: order,
        message: "Order Created Successfully",
      });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/verify", async (req, res) => {
  console.log(req.body);

  const body =
    req.body.response.razorpay_order_id +
    "|" +
    req.body.response.razorpay_payment_id;
  const appointmentId = req.body.appointmentId;
  console.log(appointmentId);

  const expectedSignature = crypto
    .createHmac("sha256", process.env.KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === req.body.response.razorpay_signature) {
    console.log(appointmentId);

    try {
      await appointModel.updateOne(
        { _id: req.body.appointmentId }, 
        { $set: { paymentStatus: "Paid" } }
      );
      if (result.nModified > 0) {
        console.log("Payment status updated successfully.");
        res.json({ success: true, message: "Payment verification successful" });
      } else {
        console.log("No matching document found or status already updated.");
        res.json({
          success: false,
          message: "No matching document found or status already updated.",
        });
      }
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Database update failed" });
    }
  } else {
    res.status(400).json({ message: "Invalid signature" });
  }
});

router.get("/payments/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    
    instance.orders.fetchPayments(orderId, (err, payments) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Failed to fetch payments", error: err });
      }

      return res
        .status(200)
        .json({
          data: payments.items,
          message: "Payments retrieved successfully",
        });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/payments/:appointmentId", async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Assuming you have a method to fetch all orders or a specific order associated with this appointment
    const orderId = await findOrderIdByAppointmentId(appointmentId); // Implement this function as needed

    if (!orderId) {
      return res
        .status(404)
        .json({ message: "No order found for this appointment" });
    }

    instance.orders.fetchPayments(orderId, (err, payments) => {
      if (err || !payments) {
        return res
          .status(404)
          .json({
            message: "Failed to fetch payments",
            error: err || "Payments not found",
          });
      }

      // Filter payments where the appointmentId matches
      const filteredPayments = payments.items.filter((payment) => {
        return payment.notes && payment.notes.appointmentId === appointmentId;
      });

      if (filteredPayments.length === 0) {
        return res
          .status(404)
          .json({ message: "No payments found for this appointment" });
      }

      return res
        .status(200)
        .json({
          data: filteredPayments,
          message: "Payments retrieved successfully",
        });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
