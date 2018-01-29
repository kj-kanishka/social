'use strict';

import React from 'react';
import { Link } from 'react-router-dom';
import * as auth from './common.jsx'

export default () => {
  return (
    <header>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          
          <ul className="nav navbar-nav navbar-left">
            <li className="active"><Link to="/">Home</Link></li>
            <li><Link to="/friends">Friends</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li><a onClick={auth.logout}>Logout</a></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
