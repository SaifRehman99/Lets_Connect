const Post = require('../../Models/Post');
const checkAuth = require('../utils/checkAuth');
const { UserInputError, AuthenticationError } = require('apollo-server');

module.exports = {
  Mutation: {
    async createComment(parent, args, context) {
      const user = checkAuth(context);

      if (!args.body) {
        return new UserInputError('Comment Cant be empty', {
          comment: 'Comment Cant be empty',
        });
      }

      try {
        const newComment = {
          body: args.body.trim(),
          username: user.username,
        };

        const post = await Post.findByIdAndUpdate(args.postID, { $push: { comments: newComment } }, { new: true });

        return post;
      } catch (error) {
        throw new Error('Error while creating comment on post');
      }
    },
    async deleteComment(parent, args, context) {
      const { username } = checkAuth(context);

      try {
        const post = await Post.findById(args.postID);

        if (!post) {
          return new UserInputError('No Post Exists');
        }

        const commentIndex = post.comments.findIndex((c) => c.id === args.commentID);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);

          await post.save();
          return post;
        } else {
          return new AuthenticationError('Permission Denied!');
        }
      } catch (error) {
        throw new Error('Error while creating comment on post');
      }
    },
  },
};
