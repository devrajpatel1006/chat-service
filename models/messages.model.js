const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  message: { type: String,  required: true },
  like_count: { type: Number,default: 0},
  status: { type: Number, default: 1 },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mongoose middleware to update 'updated_at' before saving
MessageSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = messages = mongoose.model("messages", MessageSchema);
