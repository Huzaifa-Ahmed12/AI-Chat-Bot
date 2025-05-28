// import mongoose from 'mongoose';

// const conversationSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   prompt: {
//     type: String,
//     required: true,
//   },
//   aiResponse: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   }
// });

// export default mongoose.model('Conversation', conversationSchema);

// models/Conversation.js
// import mongoose from 'mongoose';

// const { Schema, model } = mongoose;

// const conversationSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   prompt: { type: String, required: true },
//   aiResponse: { type: String, required: true },
//   title: { type: String }, // optional, no need to mark as required
//   createdAt: { type: Date, default: Date.now },
// });

// const Conversation = model('Conversation', conversationSchema);

// export default Conversation;

// models/Conversation.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'ai'], required: true },
  content: { type: String, required: true }
});

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model('Conversation', conversationSchema);


