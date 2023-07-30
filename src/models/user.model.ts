import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, lowercase: true },
  userName: { type: String, required: true, lowercase: true },
  email: { type: String, required: true, lowercase: true },
  userType: {
    type: String,
    required: true,
    enum: ["admin", "vendor", "consumer"],
    lowercase: true,
  },
  password: { type: String, require: true },
});

const User = mongoose.model("User", UserSchema);

export default User;
