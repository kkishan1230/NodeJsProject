import express from "express";
import User from "../models/user.model";

authRouter.get("/login/admin", async (req, res, next) => {
  res.send("Please Login");
});

authRouter.post("/login/admin", async (req, res, next) => {
  res.send("Please Login");
});

authRouter.get("/register/admin", async (req, res, next) => {
  res.send("Please register");
});

authRouter.post("/register/admin", async (req, res, next) => {
  try {
    const { email } = req.body;
    const doesExist = await User.findOne({ email: email });
    if (doesExist) {
      res.send("User Exists");
      return;
    }
    const user = new User(req.body);
    console.log(user);
    await user.save();
    res.send(user);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

authRouter.get("/logout", async (req, res, next) => {
  res.send("You are logged out");
});
