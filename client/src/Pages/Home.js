import React, { useContext } from 'react';
import { Grid, Transition } from 'semantic-ui-react';
import { useQuery } from '@apollo/client';

import PostCard from '../Components/PostCard';
import PostForm from '../Components/PostForm';

import { AuthContext } from '../Context/auth';

import { FETCH_POSTS_QUERY } from '../graphql';
const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className='page-title'>
        <h1>Recent Posts</h1>
      </Grid.Row>

      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Transition.Group>
            {data &&
              data.getPosts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 30 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
