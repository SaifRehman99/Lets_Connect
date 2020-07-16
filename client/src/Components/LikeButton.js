import React, { useState, useEffect } from 'react';
import { Button, Icon, Label, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const LikeButton = ({ post: { id, likes, likeCount }, user }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (user && likes.find((like) => like.username === user.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likeUnlikePost] = useMutation(LIKE_POST_MUTATION);

  const likePost = (id) => likeUnlikePost({ variables: { postID: id } });

  const like = user ? (
    liked ? (
      <Popup
        inverted
        content='Unlike a Post'
        trigger={
          <Button color='blue'>
            <Icon name='heart' />
          </Button>
        }
      />
    ) : (
      <Popup
        inverted
        content='Like a Post'
        trigger={
          <Button color='blue' basic>
            <Icon name='heart' />
          </Button>
        }
      />
    )
  ) : (
    <Popup
      inverted
      content='Login to Like a Post'
      trigger={
        <Button as={Link} to='/login' color='blue' basic>
          <Icon name='heart' />
        </Button>
      }
    />
  );

  return (
    <div>
      <Button as='div' labelPosition='right' onClick={() => likePost(id)}>
        {like}

        <Label as='a' basic color='red' pointing='left'>
          {likeCount}
        </Label>
      </Button>
    </div>
  );
};

const LIKE_POST_MUTATION = gql`
  mutation likeUnlikePost($postID: ID!) {
    # this will update the cache automatically
    # because grapqhl understand bcz here we return id
    # and this id is of TYPE POST
    # it will understand that k getPosts ki query ka ha
    #  tou khd update krdye cache ko
    # bcz createPost me humnay set kra ha sb
    # islea we return id and likes and likeCount taky post query ki ye chz update krdien
    likeUnlikePost(postID: $postID) {
      id
      likes {
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
