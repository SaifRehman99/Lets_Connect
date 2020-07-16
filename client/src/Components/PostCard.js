import React, { useContext } from 'react';
import { Button, Icon, Label, Card, Image, Popup } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import moment from 'moment';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

import { AuthContext } from '../Context/auth';

const PostCard = ({ post: { body, username, createdAt, id, likeCount, commentCount, likes } }) => {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/steve.jpg' />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment.unix(createdAt / 1000).fromNow()}
        </Card.Meta>
        <Card.Description>
          <strong>{body}</strong>
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton post={{ id, likes, likeCount }} user={user} />

        <Button as='div' labelPosition='right'>
          <Popup
            inverted
            content='Add Comment'
            trigger={
              <Button color='grey' basic as={Link} to={`/posts/${id}`}>
                <Icon name='comments' />
              </Button>
            }
          />

          <Label as='a' basic color='grey' pointing='left'>
            {commentCount}
          </Label>
        </Button>
        {user && user.username === username && <DeleteButton postID={id} />}
      </Card.Content>
    </Card>
  );
};

export default PostCard;
