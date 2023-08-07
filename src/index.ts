import dotenv from "dotenv";
import { connect } from "mongoose";
import homeRouter from "./routes/index.route";
import authRouter from "./routes/auth.route";
import userProfileRouter from "./routes/user.route";
import express from "express";
import userLogin from "./routes/userlogin.route";
import morgan from "morgan";

dotenv.config();

const mongoDbUri = "mongodb://127.0.0.1:27017/Users";

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connect(mongoDbUri)
  .then(() => {
    console.log("connected to database");
    app.listen(3000, () => {
      console.log("server Connected on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", homeRouter);
app.use("/auth", authRouter);
app.use("/user", userProfileRouter);
app.use("/userlogin", userLogin);

app.use((req, res, next) => {
  res.send("Page Not found");
});
