import { gql } from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      commentCount
      likeCount
      id
      comments {
        body
        username
        id
        createdAt
      }
      likes {
        username
      }
    }
  }
`;
