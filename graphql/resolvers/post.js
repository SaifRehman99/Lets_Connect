const Post = require('../../Models/Post');
const checkAuth = require('../utils/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 }).sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(parent, args) {
      try {
        const post = await Post.findById(args.postID);
        if (post) return post;
        else throw new Error('Post not found');
      } catch (error) {
        throw new Error('Error while fetching post');
      }
    },
  },
  Mutation: {
    async createPost(parent, args, context) {
      const user = checkAuth(context);

      const newPost = new Post({
        body: args.body,
        user: user.id,
        username: user.username,
      });

      const post = await newPost.save();
      return post;
    },
    async deletePost(parent, args, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(args.postID);

        if (post.username.toString() === user.username.toString()) {
          await post.delete();
          return 'Post deleted successfully';
        }

        return new AuthenticationError('Permission Denied');
      } catch (error) {
        throw new Error('Error while fetching post');
      }
    },
    async likeUnlikePost(parent, args, context) {
      const { username } = checkAuth(context);

      try {
        let findLike = await Post.findById(args.postID);

        // If post is already liked, unlike it
        if (findLike.likes.filter((like) => like.username.toString() === username).length > 0) {
          findLike.likes = findLike.likes.filter((like) => like.username !== username);
          await findLike.save();
          return findLike;
        } else {
          const post = await Post.findByIdAndUpdate(
            args.postID,
            {
              $push: {
                likes: {
                  username,
                },
              },
            },
            { new: true },
          );

          return post;
        }
      } catch (error) {
        throw new Error('Error while like post');
      }
    },
  },
};
