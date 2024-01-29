const mongoose = require("mongoose");

const messageLikesSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  message_id: { type: String,  required: true },
  status: {
    type: Number,
    default: 1,
    // 1: Like
    // 0: Unlike
    // Add comments to describe the meaning of each status value
    validate: {
      validator: (value) => value === 1 || value === 0,
      message: 'Status must be either 1 (Like) or 0 (Unlike).',
    },
  },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mongoose middleware to update 'updated_at' before saving
messageLikesSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = messageLikes = mongoose.model("messageLikes", messageLikesSchema);
