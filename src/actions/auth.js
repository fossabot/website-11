import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';

import config from '../config';

const cognitoPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: config.auth.userPoolId,
    ClientId: config.auth.userPoolWebClientId,
});

export const LOAD_CURRENT_AUTH_REQUEST = 'LOAD_CURRENT_AUTH_REQUEST';
export const LOAD_CURRENT_AUTH_SUCCESS = 'LOAD_CURRENT_AUTH_SUCCESS';
export const LOAD_CURRENT_AUTH_ERROR = 'LOAD_CURRENT_AUTH_ERROR';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const SETUP_MFA_REQUEST = 'SETUP_MFA_REQUEST';
export const SETUP_MFA_GOT_SECRET = 'SETUP_MFA_GOT_SECRET';
export const SETUP_MFA_ERROR = 'SETUP_MFA_ERROR';
export const CONFIRM_MFA_REQUEST = 'CONFIRM_MFA_REQUEST';
export const CONFIRM_MFA_SUCCESS = 'CONFIRM_MFA_SUCCESS';
export const CONFIRM_MFA_ERROR = 'CONFIRM_MFA_ERROR';

export const loadCurrentAuth = () => {
    return dispatch => {
        dispatch({ type: LOAD_CURRENT_AUTH_REQUEST });

        const cognitoUser = cognitoPool.getCurrentUser();

        if (!cognitoUser) {
            dispatch({ type: LOAD_CURRENT_AUTH_ERROR });
            return;
        }

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
            const { email, sub: id, email_verified: emailVerified } = session.getIdToken().payload;

            const attributes = {
                id,
                email,
                emailVerified,
            };

            const tokens = {
                id: idToken,
                refresh: refreshToken,
            };

            dispatch({ type: LOAD_CURRENT_AUTH_SUCCESS, attributes, tokens });
        });
    };
};

export const login = ({ email, password }) => {
    return dispatch => {
        dispatch({ type: LOGIN_REQUEST, email, password });

        const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username: email,
            Password: password,
        });

        const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
            Username: email,
            Pool: cognitoPool,
        });

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                const idToken = result.getIdToken().getJwtToken();
                const refreshToken = result.getRefreshToken().getToken();
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
                };

                dispatch({ type: LOGIN_SUCCESS, tokens, attributes });
            },

            onFailure: function(err) {
                dispatch({ type: LOGIN_ERROR, error: err.message });
            },

            mfaSetup: function(challengeName, challengeParameters) {
                cognitoUser.associateSoftwareToken(this);
            },

            associateSecretCode: function(secretCode) {
                var challengeAnswer = prompt('Please input the TOTP code.', '');
                cognitoUser.verifySoftwareToken(challengeAnswer, 'My TOTP device', this);
            },

            selectMFAType: function(challengeName, challengeParameters) {
                cognitoUser.sendMFASelectionAnswer('SOFTWARE_TOKEN_MFA', this);
            },

            totpRequired: function(secretCode) {
                var challengeAnswer = prompt('Please input the TOTP code.', '');
                cognitoUser.sendMFACode(challengeAnswer, this, 'SOFTWARE_TOKEN_MFA');
            },

            mfaRequired: function(codeDeliveryDetails) {
                var verificationCode = prompt('Please input verification code', '');
                cognitoUser.sendMFACode(verificationCode, this);
            },
        });
    };
};

export const logout = () => {
    return dispatch => {
        dispatch({ type: LOGOUT_REQUEST });

        const cognitoUser = cognitoPool.getCurrentUser();

        if (cognitoUser !== null) {
            cognitoUser.signOut();
        }

        dispatch({ type: LOGOUT_SUCCESS });
    };
};

export const setupMfa = () => {
    return dispatch => {
        const cognitoUser = cognitoPool.getCurrentUser();

        dispatch({ type: SETUP_MFA_REQUEST });

        if (cognitoUser !== null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    dispatch({ type: SETUP_MFA_ERROR, error: err });
                    return;
                }

                if (!session.isValid()) {
                    dispatch({ type: SETUP_MFA_ERROR, error: err });
                    return;
                }

                cognitoUser.associateSoftwareToken({
                    associateSecretCode: function(secretCode) {
                        dispatch({ type: SETUP_MFA_GOT_SECRET, secretCode });
                    },
                });
            });
        }
    };
};

export const confirmMfa = code => {
    return dispatch => {
        const cognitoUser = cognitoPool.getCurrentUser();

        dispatch({ type: CONFIRM_MFA_REQUEST });

        if (cognitoUser !== null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    dispatch({ type: CONFIRM_MFA_ERROR, error: err });
                    return;
                }

                if (!session.isValid()) {
                    dispatch({ type: CONFIRM_MFA_ERROR, error: err });
                    return;
                }

                cognitoUser.verifySoftwareToken(code, 'My TOTP device', {
                    onSuccess: function (secretCode) {
                        cognitoUser.setUserMfaPreference(
                            null,
                            {
                                PreferredMfa: true,
                                Enabled: true,
                            },
                            function(err, result) {
                                if (err) {
                                    dispatch({ type: CONFIRM_MFA_ERROR, error: err.message });
                                    return;
                                }

                                dispatch({ type: CONFIRM_MFA_SUCCESS, secretCode });
                            },
                        );
                    },

                    onFailure: function(err) {
                        dispatch({ type: CONFIRM_MFA_ERROR, error: err.message });
                    },
                });
            });
        }
    };
};
