const postResolvers = require('./post');
const commentResolvers = require('./comment');
const userResolvers = require('./user');

module.exports = {
  // hr Query ya mutaions pr ye call huga tou yahn krhy hain
  Post: {
    commentCount: (parent) => parent.comments.length,
    likeCount: (parent) => parent.likes.length,
  },
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
};
