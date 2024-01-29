const mongoose = require("mongoose");

const GroupsSchema = new mongoose.Schema({
  group_name: { type: String, required: true },
  // group_admin_id: { type: String, required: true },
  group_admin_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  status: { type: Number, default: 1 },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mongoose middleware to update 'updated_at' before saving
GroupsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = Groups = mongoose.model("groups", GroupsSchema);
