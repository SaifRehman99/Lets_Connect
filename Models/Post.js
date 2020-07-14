const { Schema, model } = require('mongoose');

const postSchema = new Schema({
  body: String,
  username: String,
  createdAt: { type: Date, default: Date.now() },
  comments: [
    {
      body: String,
      username: String,
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  likes: [
    {
      username: String,
      createdAt: { type: Date, default: Date.now() },
    },
  ],
  user: { type: Schema.Types.ObjectId, ref: 'user' },
});

module.exports = model('post', postSchema);
