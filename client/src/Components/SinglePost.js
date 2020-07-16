import React, { useState, useContext, useRef } from 'react';
import { Card, Image, Grid, Button, Icon, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/auth';
import moment from 'moment';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { gql, useQuery, useMutation } from '@apollo/client';

const SinglePost = ({ match, history }) => {
  const postId = match.params.postId;
  const commentInput = useRef(null);

  const { user } = useContext(AuthContext);

  const [comment, setComment] = useState('');

  const { loading, error, data } = useQuery(FETCH_POST_QUERY, { variables: { postID: postId } });

  const [createComment] = useMutation(ADD_COMMENT_MUTATION, {
    update(proxy, result) {
      setComment('');
      commentInput.current.blur();
    },
  });

  const DeleteButtonCallback = () => {
    history.push('/');
  };

  let postMarkup;

  if (!data) {
    postMarkup = <p>Loading...</p>;
  } else {
    const { id, username, createdAt, body, comments, likes, likeCount, commentCount } = data.getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/steve.jpg' />
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts/${id}`}>
                  {moment.unix(createdAt / 1000).fromNow()}
                </Card.Meta>
                <Card.Description>
                  <strong>{body}</strong>
                </Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton post={{ id, likes, likeCount }} user={user} />

                <Button as='div' labelPosition='right' onClick={() => console.log('Comment')}>
                  <Button basic color='blue'>
                    <Icon name='comments' />
                    <label color='blue' pointing='left'>
                      {commentCount}
                    </label>
                  </Button>
                </Button>
                {user && user.username === username && <DeleteButton postID={id} callback={DeleteButtonCallback} />}
              </Card.Content>
            </Card>

            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form>
                    <div className='ui action input fluid'>
                      <input
                        type='text'
                        placeholder='Post a comment'
                        name='comment'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInput}
                      />
                      <button
                        type='submit'
                        className='ui button teal'
                        disabled={comment === ''}
                        onClick={() => createComment({ variables: { postID: id, body: comment } })}>
                        Add
                      </button>
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}

            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta> {moment.unix(comment.createdAt / 1000).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>

                  {user && user.username === comment.username && <DeleteButton postID={id} commentID={comment.id} />}
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
};

const FETCH_POST_QUERY = gql`
  query($postID: ID!) {
    getPost(postID: $postID) {
      id
      username
      body
      createdAt
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
    }
  }
`;

const ADD_COMMENT_MUTATION = gql`
  mutation($postID: ID!, $body: String!) {
    createComment(postID: $postID, body: $body) {
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

export default SinglePost;
