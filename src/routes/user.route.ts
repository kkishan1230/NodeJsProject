import express from "express";

const userProfileRouter = express.Router();

userProfileRouter.get("/profiles", async (req, res, next) => {
  res.send("Profile Page");
});

export default userProfileRouter;
