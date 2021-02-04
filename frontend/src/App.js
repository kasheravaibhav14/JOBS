import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import UsersList from './components/Users/UsersList'
import Home from './components/Common/Home'
import Register from './components/Common/Register'
import SignIn from './components/Common/Login'
import Navbar from './components/templates/Navbar'
import Profile from './components/Users/Profile'
import editProfile from './components/Users/editProfile'
import RecDash from './components/Dashboard/RecDash'
import MyApps from './components/Dashboard/myApps'
import RecAppDash from './components/Dashboard/recApps'
import AccAppDash from './components/Dashboard/accApps'

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <br />
        <Route path="/" exact component={Home} />
        {/* <Route path="/users" exact component={UsersList}/> */}
        <Route path="/register" component={Register} />
        <Route path="/signIn" component={SignIn} />
        <Route path="/profile" component={Profile} />
        <Route path="/profileEdit" component={editProfile} />
        <Route path="/dashView" component={RecDash} />
        <Route path="/myApps" component={MyApps} />
        <Route path="/activeApps" component={RecAppDash} />
        <Route path="/accApps" component={AccAppDash} />
      </div>
    </Router>
  );
}

export default App;
