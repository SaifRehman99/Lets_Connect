import React, { useState } from 'react';
import { Button, Icon, Popup, Confirm } from 'semantic-ui-react';

import { gql, useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../graphql';

const DeleteButton = ({ postID, callback, commentID }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentID ? DELETE_COMMENT_QUERY : DELETE_POST_QUERY;

  const [deletePostorComment] = useMutation(mutation, {
    update(proxy, result) {
      setConfirmOpen(false);
      if (callback) callback();

      if (!commentID) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            getPosts: data.getPosts.filter((post) => post.id !== postID),
          },
        });
      }
    },
    variables: { postID, commentID },
  });

  return (
    <>
      <Popup
        inverted
        content={commentID ? 'Delete Comment' : 'Delete Post'}
        trigger={
          <Button as='div' color='red' floated='right' onClick={() => setConfirmOpen(true)}>
            <Icon name='trash' />
          </Button>
        }
      />

      <Confirm open={confirmOpen} onCancel={() => setConfirmOpen(false)} onConfirm={deletePostorComment} />
    </>
  );
};

const DELETE_POST_QUERY = gql`
  mutation deletePost($postID: ID!) {
    deletePost(postID: $postID)
  }
`;

const DELETE_COMMENT_QUERY = gql`
  mutation deleteComment($postID: ID!, $commentID: ID!) {
    deleteComment(postID: $postID, commentID: $commentID) {
      # post id return islea cache khd update huga
      id
      body
      comments {
        body
        id
        createdAt
        username
      }
      commentCount
    }
  }
`;

export default DeleteButton;
