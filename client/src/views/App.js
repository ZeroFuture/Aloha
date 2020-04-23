import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Error from './Error';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/home" render={(props) => <Home {...props} />} />
        <Route path="/signup" render={(props) => <Signup {...props} />} />
        <Route path="/login" render={(props) => <Login {...props} />} />
        <Route path="/error" render={(props) => <Error {...props} />} />
        <Route path="/">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </Router>
  );
}