import React, { createContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';

const initialState = {
  user: null,
};

// setting the user here taky refresh me ye set kry ( presist )
if (localStorage.getItem('token')) {
  const decoded = jwtDecode(localStorage.getItem('token'));

  if (decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem('token');
  } else {
    initialState.user = decoded;
  }
}

const AuthContext = createContext({
  user: null,
  LOGIN: (data) => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function LOGIN(data) {
    localStorage.setItem('token', data.token);
    dispatch({
      type: 'LOGIN',
      payload: data,
    });
  }

  function logout() {
    localStorage.removeItem('token');
    dispatch({
      type: 'LOGOUT',
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        LOGIN,
        logout,
      }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };
