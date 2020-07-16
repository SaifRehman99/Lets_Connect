import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';

// for setting the token to every request
import { setContext } from 'apollo-link-context';

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/',
});

const setAuthorizationLink = setContext((request, previousContext) => {
  const token = localStorage.getItem('token');

  return {
    headers: { Authorization: token ? `Bearer ${token}` : '' },
  };
});

const client = new ApolloClient({
  link: setAuthorizationLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
