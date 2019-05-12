import { connect } from 'react-redux';
import React, { useEffect } from 'react';

import Login from '../../components/auth/Login/Login';

const mapStateToProps = state => ({
    loggedIn: state.auth.loggedIn,
});

export default connect(mapStateToProps)(({ loggedIn, history }) => {
    useEffect(() => {
        if (loggedIn) {
            history.push('/');
        }
    });

    return <Login />;
});
