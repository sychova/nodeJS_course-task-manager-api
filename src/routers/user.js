const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { uploadImage } = require("../middleware/fileUpload");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");
const router = new express.Router();
const multer = require("multer");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();

    sendWelcomeEmail(user.email, user.name);

    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (error) {
    res.status(400).json();
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json();
  } catch (error) {
    res.status(500).json();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.json();
  } catch (error) {
    res.status(500).json();
  }
});

router.get("/users/me", auth, async (req, res) => {
  res.json(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).json({ error: "Property doesn't exist." });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    if (!req.user) {
      return res.status(404).json();
    }
    res.json(req.user);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();

    sendCancelationEmail(req.user.email, req.user.name);

    res.json(req.user);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post(
  "/users/me/avatar",
  auth,
  uploadImage().single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.json();
  },
  (error, req, res, next) => {
    res.status(500).json({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.json();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.json(user.avatar);
  } catch (error) {
    res.status(404).json(error);
  }
});

module.exports = router;
