import express from "express";
import User from "../models/user.model";

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

authRouter.post("/register", async (req, res, next) => {
  try {
    const userData = req.body;
    const doesExist = await User.findOne({ email: userData.email });
    if (doesExist) {
      res.send("User Exists");
      return;
    }

    const user = new User(req.body);
    console.log(user);
    await user.save();
    res.send(user);
  } catch (err) {
    res.send(
      `${req.body.userType} is not a valid role. "Admin", "Vendor" and "Consumer" are the valid role`
    );
  }
});

// logout
authRouter.get("/logout", async (req, res, next) => {
  res.send("You are logged out");
});

export default authRouter;
