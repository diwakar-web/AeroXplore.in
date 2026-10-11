const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    photoURL: {
      type: String,
      default: '',
    },
    uid: {
      type: String,
      sparse: true,
    },
    authProvider: {
      type: String,
      enum: ['google', 'jwt', 'email'],
      default: 'jwt',
    },
    password: {
      type: String,
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    creatorGuidelinesAccepted: {
      type: Boolean,
      default: false,
    },
    creatorGuidelinesAcceptedAt: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
