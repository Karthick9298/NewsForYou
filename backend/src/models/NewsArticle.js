import mongoose from 'mongoose';

const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];

const newsArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      unique: true, // primary deduplication key
      index: true,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    briefDescription: {
      type: String,
      default: null,
    },
    detailDescription: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
      index: true,
    },
    publishedBy: {
      type: String, // source name e.g. "BBC News"
      default: null,
    },
    sourceId: {
      type: String, // source identifier from NewsAPI e.g. "bbc-news"
      default: null,
    },
    author: {
      type: String,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound index for efficient per-category, per-date queries
newsArticleSchema.index({ category: 1, createdAt: -1 });

export const ARTICLE_CATEGORIES = CATEGORIES;
export default mongoose.model('NewsArticle', newsArticleSchema);
