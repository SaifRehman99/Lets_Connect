import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { AuthContext } from '../Context/auth';

const PrivateRoute2 = ({ component: Component, ...rest }) => {
  const { user } = useContext(AuthContext);
  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to='/login' />)} />;
};

export default PrivateRoute2;
