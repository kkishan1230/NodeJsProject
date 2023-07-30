import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";

const authRouter = express.Router();

// register view
authRouter.get("/register", async (req, res, next) => {
  res.send("Please register");
});

// login view
authRouter.get("/login", async (req, res, next) => {
  res.send("Please Login");
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

// login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userInDb = await User.findOne({
      email: email,
    });
    if (!userInDb) {
      return res.send({ error: "Invalid credentials" });
    }
    const passwordMatch = await bcrypt.compare(password, userInDb.password);
    if (!passwordMatch) {
      return res.send("email or password is incorrect");
    } else {
      res.send("logged in");
    }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong. Please try after sometime");
  }
});

export default authRouter;
