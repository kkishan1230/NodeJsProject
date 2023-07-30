import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      return res.send("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    if (userData?.userType === "admin") {
      const token = jwt.sign({ userData }, process.env.SECRET_KEY_Admin, {
        expiresIn: "2h",
      });
      const user = new User(userData);
      await user.save();
      return res.send(token);
    }

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

    const passwordMatch = await bcrypt.compare(password, userInDb.password);
    if (userInDb?.userType === "admin" && passwordMatch) {
      const token = req.header("authorization");

      if (!token) {
        return res.send("You are not authorized");
      }

      try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY_Admin);
        console;
        if (decodedToken.userData.email === userInDb.email) {
          return res.send("user authorized");
        } else {
          return res.send("token invalid");
        }
      } catch (error) {
        return res.send(error);
      }
    }

    if (userInDb?.userType === "vendor") {
      const token = jwt.sign({ userInDb }, process.env.SECRET_KEY_Vendor, {
        expiresIn: "1h",
      });
      return res.send(token);
    }

    if (!userInDb) {
      return res.send({ error: "Invalid credentials" });
    }
    // const passwordMatch = await bcrypt.compare(password, userInDb.password);
    // if (!passwordMatch) {
    //   return res.send("email or password is incorrect");
    // } else {
    //   res.send("logged in");
    // }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong. Please try after sometime");
  }
});

export default authRouter;
