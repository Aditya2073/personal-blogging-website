import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  },
  lastModified: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
postSchema.index({ date: -1 });
postSchema.index({ tags: 1 });

// Pre-save middleware to update lastModified
postSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Post = mongoose.model('Post', postSchema);

export default Post;
