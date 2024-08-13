const express = require("express");
const userModel = require("./userModel");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateToken = require("../Middlewares/validateToken");
const isAdmin = require("../Middlewares/admin");


userRouter.post("/register", async (req, res) => {
  try {
    const userExists = await userModel.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(401).json({ message: "User Already Exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    await userModel.create(req.body);

    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }
    const token = jwt.sign(
      { _id: user._id, status: user.status, name : user.name },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    return res
      .status(200)
      .json({ token,_id: user._id, status: user.status, name: user.name, message: "Login Successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

userRouter.put(
  "/updateStatus/:userId",
  validateToken,
  isAdmin,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const { status } = req.body;

      if (!["User", "Admin", "Doctor"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.status = status;

      const updatedUser = await user.save();

      return res
        .status(200)
        .json({ message: "Status Updated Successfully", user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
);

userRouter.get("/current-user",validateToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res
      .status(200)
      .json({ data: user, message: "User Fetched Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = userRouter;
