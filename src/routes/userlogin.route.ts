import express from "express";
const userLogin = express.Router();

userLogin.post("/userlogin", (req, res) => {
  console.log("something");
  return res.send("Home Page");
});

export default userLogin;
