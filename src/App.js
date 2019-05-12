import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Home from './views/Home/Home';
import Login from './views/Login/Login';

const App = ({ loggedIn }) => {
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        {!loggedIn && (
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
            </div>
        </Router>
    );
};

export default connect(({ auth: { loggedIn } }) => ({ loggedIn }))(App);
