import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    interests: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 4,
        message: 'You can select at most 4 interests.',
      },
    },
    notificationTime: {
      type: String,
      enum: ['morning', 'night', null],
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
