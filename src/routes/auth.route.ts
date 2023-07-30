import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

const authRouter = express.Router();

// login
authRouter.get("/login", async (req, res, next) => {
  res.send("Please Login");
});

authRouter.post("/login", async (req, res, next) => {
  res.send("Please Login");
});

// register
authRouter.get("/register", async (req, res, next) => {
  res.send("Please register");
});

// registered new user
authRouter.post("/register", async (req, res, next) => {
  try {
    const userData = req.body;
    const doesExist = await User.findOne({ email: userData.email });
    if (doesExist) {
      res.send("User already Exists");
      return;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    const user = new User(userData);
    await user.save();
    res.send(user);
  } catch (err) {
    console.log(err);
    res.send(
      `${req.body.userType} is not a valid role. "admin", "vendor" and "consumer" are the valid role`
    );
  }
});

export default authRouter;
