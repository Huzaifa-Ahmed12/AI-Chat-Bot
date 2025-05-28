// ✅ server/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  interests: {
    type: [String],
    default: []
  }
});

export const User = mongoose.model('User', userSchema);