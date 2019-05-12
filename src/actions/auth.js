import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import config from '../config';

export const LOGIN = 'LOGIN';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const login = ({ email, password, rememberMe = false }) => {
    return dispatch => {
        dispatch({ type: LOGIN_REQUEST, email, password, rememberMe });

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: new AmazonCognitoIdentity.CognitoUserPool({
                UserPoolId: config.auth.userPoolId,
                ClientId: config.auth.userPoolWebClientId,
            }),
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                const idToken = result.getIdToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken();
                const expiration = result.getIdToken().getExpiration();
                const {
                    email,
                    sub: id,
                    email_verified: emailVerified,
                } = result.getIdToken().payload;

                const attributes = {
                    id,
                    email,
                    emailVerified,
                };

                const tokens = {
                    id: idToken,
                    refresh: refreshToken,
                    expiration: expiration,
                };

                dispatch({ type: LOGIN_SUCCESS, tokens, attributes });
            },

            onFailure: function(err) {
                dispatch({ type: LOGIN_ERROR, error: err.message });
            },
        });
    };
};
