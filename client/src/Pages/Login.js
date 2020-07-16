import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../Context/auth';

const Login = ({ history }) => {
  const { LOGIN } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [login, { loading }] = useMutation(LOGIN_USER_QUERY, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      console.log(err.graphQLErrors[0].extensions.exception.errors);
    },
    update(proxy, result) {
      console.log(result.data.login);
      LOGIN(result.data.login);
      history.push('/');
    },
  });

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const { username, password } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    login({ variables: { username, password } });
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Login</h1>
        <Form.Input
          label='Username'
          placeholders='Username...'
          name='username'
          error={errors.username ? true : false}
          value={username}
          type='text'
          onChange={onChange}
        />
        <Form.Input
          label='Password'
          placeholders='Password...'
          name='password'
          error={errors.passsword ? true : false}
          value={password}
          type='password'
          onChange={onChange}
        />
        <Button content='Login' secondary type='submit' />
      </Form>

      {Object.keys(errors).length > 0 && (
        <div className='ui error message'>
          <ul className='list'>
            {Object.values(errors).map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const LOGIN_USER_QUERY = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Login;
