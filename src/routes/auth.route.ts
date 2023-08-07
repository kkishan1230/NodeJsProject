import express from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";

const authRouter = express.Router();

let SECRET_KEY_Vendor = process.env.SECRET_KEY_Vendor;

type UserData = {
  email: string;
  password: string;
  userName: string;
  userType: string;
  name: string;
};

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
    const userData: UserData = req.body;
    const doesExist = await User.findOne({ email: userData.email });

    if (doesExist) {
      return res.send("User already Exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashedPassword;

    if (userData?.userType === "admin" && process.env.SECRET_KEY_Admin) {
      const token = jwt.sign({ userData }, process.env.SECRET_KEY_Admin, {
        expiresIn: "2h"
      });
      const user = new User(userData);
      await user.save();
      return res.send({ token: token });
    }

    const user = new User(userData);
    await user.save();
    res.send(user);
  } catch (err) {
    res.send(
      `${req.body.userType} is not a valid role. "admin", "vendor" and "consumer" are the valid role`
    );
  }
});

// login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userInDb: UserData | null = await User.findOne({
      email: email
    });

    if (userInDb && process.env.SECRET_KEY_Admin) {
      const passwordMatch = await bcrypt.compare(password, userInDb.password);
      if (
        userInDb?.userType === "admin" &&
        passwordMatch &&
        process.env.SECRET_KEY_Admin
      ) {
        const token = req.header("authorization");

        if (!token) {
          return res.send("You are not authorized");
        }

        try {
          const decodedToken = jwt.verify(
            token,
            process.env.SECRET_KEY_Admin
          ) as JwtPayload;

          if (decodedToken.userData.email === userInDb.email) {
            return res.send("user authorized");
          } else {
            return res.send("token invalid");
          }
        } catch (error) {
          return res.send(error);
        }
      }
    }

    if (userInDb?.userType === "vendor" && SECRET_KEY_Vendor) {
      const token = jwt.sign({ userInDb }, SECRET_KEY_Vendor, {
        expiresIn: "1h"
      });
      return res.send(token);
    }

    if (!userInDb) {
      return res.send({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.send("Something went wrong. Please try after sometime");
  }
});

// userlogin test
authRouter.post("/userlogin", async (req, res) => {
  const userData = req.body;
  if (userData.userName && userData.password) {
    return res.send({ message: "kishan" });
  } else {
    return res.send("userName or password is missing");
  }
});

export default authRouter;
