import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import config from '../config';

export const LOAD_CURRENT_AUTH_REQUEST = 'LOAD_CURRENT_AUTH_REQUEST';
export const LOAD_CURRENT_AUTH_SUCCESS = 'LOAD_CURRENT_AUTH_SUCCESS';
export const LOAD_CURRENT_AUTH_ERROR = 'LOAD_CURRENT_AUTH_ERROR';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const loadCurrentAuth = () => {
    return dispatch => {
        dispatch({ type: LOAD_CURRENT_AUTH_REQUEST });

        const cognitoPool = new AmazonCognitoIdentity.CognitoUserPool({
            UserPoolId: config.auth.userPoolId,
            ClientId: config.auth.userPoolWebClientId,
        });

        const cognitoUser = cognitoPool.getCurrentUser();

        cognitoUser.getSession((err, session) => {
            if (err) {
                dispatch({ type: LOAD_CURRENT_AUTH_ERROR });
                return;
            }

            if (!session.isValid()) {
                dispatch({ type: LOAD_CURRENT_AUTH_ERROR });
                return;
            }

            const idToken = session.getIdToken().getJwtToken();
            const refreshToken = session.getRefreshToken().getToken();
            const expiration = session.getIdToken().getExpiration();
            const { email, sub: id, email_verified: emailVerified } = session.getIdToken().payload;

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

            dispatch({ type: LOAD_CURRENT_AUTH_SUCCESS, attributes, tokens });
        });
    };
};

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
                cognitoUser.cacheTokens();
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

