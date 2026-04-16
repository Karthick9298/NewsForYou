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
      enum: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'],
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
    bookmarks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsArticle',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
