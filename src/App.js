import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { loadCurrentAuth } from './actions/auth';

import Home from './views/Home/Home';
import Login from './views/Login/Login';
import Logout from './views/Logout/Logout';

const App = ({ dispatch, loggedIn }) => {
    useEffect(() => {
        dispatch(loadCurrentAuth());
    }, [dispatch]);

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
                        {loggedIn && (
                            <li>
                                <Link to="/logout">Logout</Link>
                            </li>
                        )}
                    </ul>
                </nav>

                <Route path="/" exact component={Home} />
                <Route path="/login" exact component={Login} />
                <Route path="/logout" exact component={Logout} />
            </div>
        </Router>
    );
};

export default connect(({ auth: { loggedIn } }) => ({ loggedIn }))(App);
