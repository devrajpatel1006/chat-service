const mongoose = require("mongoose");

const GroupMembersSchema = new mongoose.Schema({
  // group_id: { type: String, required: true },
  // user_id: { type: String, required: true },

  group_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  
  is_admin: { type: String, enum: [1, 0], default:0, required: true },
  status: { type: Number, default: 1 },
  is_deleted: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Mongoose middleware to update 'updated_at' before saving
GroupMembersSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

module.exports = GroupMembers = mongoose.model("GroupMembers", GroupMembersSchema);


