import React from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import SinglePost from './Components/SinglePost';

import Menubar from './Components/Menubar';

import { AuthProvider } from './Context/auth';

import PrivateRoute from './Components/AuthRoute';
import PrivateRoute2 from './Components/AuthRoute2';

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Container>
            <Menubar />
            <Switch>
              <Route exact path='/' component={Home} />
              <PrivateRoute exact path='/login' component={Login} />
              <PrivateRoute exact path='/register' component={Register} />
              <PrivateRoute2 exact path='/posts/:postId' component={SinglePost} />
            </Switch>
          </Container>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
