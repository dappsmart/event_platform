import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: { type: String, required: true, unique: false },
  email: { type: String, required: false, unique: false },
  username: { type: String, required: false, unique: false },
  firstName: { type: String, required: false },
  lastName: {type: String, required: false },
  photo: { type: String, required: false },
})

const User = models.User || model('User', UserSchema);

export default User;

