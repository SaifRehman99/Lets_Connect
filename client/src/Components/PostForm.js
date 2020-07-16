import React, { useState } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { gql, useMutation } from '@apollo/client';

import { FETCH_POSTS_QUERY } from '../graphql';

const PostForm = () => {
  const [formData, setFormData] = useState({
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    update(proxy, result) {
      // Reading and writing data to cache

      // when create Post, we are writing data to the cache results

      // takay jesay add krein screen p show hu

      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });

      const newPost = result.data.createPost;

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [newPost, ...data.getPosts],
        },
      });
      setFormData({ body: '' });
    },
  });

  const { body } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    createPost({ variables: { body } });
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate>
        <h1>Create a Post</h1>
        <Form.Input
          label='Create a Post...'
          placeholders='Create a Post...'
          name='body'
          value={body}
          type='text'
          error={error ? true : false}
          onChange={onChange}
        />
        <Button content='Create' secondary type='submit' />
      </Form>
      {error && (
        <div className='ui error message'>
          <ul className='list'>
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

export default PostForm;
