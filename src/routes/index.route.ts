import express from "express";

const homeRouter = express.Router();

homeRouter.get("/", (req, res, next) => {
  res.send("Home Page");
});

export default homeRouter;
