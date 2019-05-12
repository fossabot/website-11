import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { logout } from '../../actions/auth';

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
});

export default connect(mapStateToProps)(({ dispatch, loggedIn, history }) => {
    useEffect(() => {
        if (!loggedIn) {
            history.push('/');
        }
    });

    dispatch(logout());

    return <h3>Logging Out</h3>;
});
