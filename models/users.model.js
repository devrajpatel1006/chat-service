const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true},
  role: { type: String, enum: ['admin', 'user'], required: true },
  email: { type: String, required: true, unique: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  password: { type: String, required: true },
  status: { type: Number, default: 1 },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mongoose middleware to update 'updated_at' before saving
UsersSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = Users = mongoose.model("users", UsersSchema);
