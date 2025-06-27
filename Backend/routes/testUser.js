const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.get("/create-user", async (req, res) => {
  try {
    const userExists = await User.findOne({ email: "geeta@example.com" });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      fullName: "Ronak Sheladiya",
      email: "ronak2@example.com",
      mobile: "9876543210",
      password: "test1234",
      address: {
        street: "123 Main Street",
        city: "Surat",
        state: "Gujarat",
        pincode: "395007",
      },
    });

    await newUser.save();
    res.status(201).json({ message: "User created. DB & Collection initialized." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
