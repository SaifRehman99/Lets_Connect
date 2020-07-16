import React, { useState, useContext } from 'react';
import { Form, Button } from 'semantic-ui-react';

import { gql, useMutation } from '@apollo/client';

import { AuthContext } from '../Context/auth';

const Register = ({ history }) => {
  const { LOGIN } = useContext(AuthContext);

  const [errors, setErrors] = useState({});
  const [register, { loading }] = useMutation(REGISTER_USER_QUERY, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
      console.log(err.graphQLErrors[0].extensions.exception.errors);
    },
    update(proxy, result) {
      console.log(result.data.register);
      LOGIN(result.data.register);
      history.push('/login');
    },
  });

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { username, email, password, confirmPassword } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    register({ variables: { username, email, password, confirmPassword } });
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
        <h1>Register</h1>
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
          label='Email'
          placeholders='Email...'
          name='email'
          error={errors.email ? true : false}
          value={email}
          type='text'
          onChange={onChange}
        />
        <Form.Input
          label='Password'
          placeholders='Password...'
          name='password'
          value={password}
          type='password'
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label='Confirm Password'
          placeholders='Confirm Password...'
          name='confirmPassword'
          type='password'
          error={errors.confirmPassword ? true : false}
          value={confirmPassword}
          onChange={onChange}
        />
        <Button content='Register' secondary type='submit' />
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

const REGISTER_USER_QUERY = gql`
  mutation register($username: String!, $email: String!, $password: String!, $confirmPassword: String!) {
    register(registerInput: { username: $username, email: $email, password: $password, confirmPassword: $confirmPassword }) {
      id
      email
      username
      createdAt
      token
    }
  }
`;

export default Register;
