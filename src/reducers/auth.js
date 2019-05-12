import * as actions from '../actions/auth';

const defaultState = {
    loggedIn: false,
    tokens: null,
    attributes: null,
    loggingIn: false,
    error: null,
    loading: false,
    mfa: {
        enabled: false,
        loading: false,
        confirming: false,
        secret: null,
    },
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case actions.LOAD_CURRENT_AUTH_REQUEST:
            return {
                ...defaultState,
                loading: true,
            };
        case actions.LOAD_CURRENT_AUTH_SUCCESS:
            return {
                ...defaultState,
                loggedIn: true,
                tokens: action.tokens,
                attributes: action.attributes,
            };
        case actions.LOAD_CURRENT_AUTH_ERROR:
            return defaultState;
        case actions.LOGIN_REQUEST:
            return {
                ...defaultState,
                loggingIn: true,
            };
        case actions.LOGIN_SUCCESS:
            return {
                ...defaultState,
                loggedIn: true,
                tokens: action.tokens,
                attributes: action.attributes,
            };
        case actions.LOGIN_ERROR:
            return {
                ...defaultState,
                error: action.error,
            };
        case actions.LOGOUT_REQUEST:
        case actions.LOGOUT_SUCCESS:
            return defaultState;
        case actions.SETUP_MFA_REQUEST:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    loading: true,
                },
            };
        case actions.SETUP_MFA_GOT_SECRET:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    loading: false,
                    secret: action.secretCode,
                },
            };
        case actions.SETUP_MFA_ERROR:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    loading: false,
                },
            };
        case actions.CONFIRM_MFA_REQUEST:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    confirming: true,
                },
            };
        case actions.CONFIRM_MFA_SUCCESS:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    confirming: false,
                    enabled: true,
                },
            };
        case actions.CONFIRM_MFA_ERROR:
            return {
                ...state,
                mfa: {
                    ...state.mfa,
                    confirming: false,
                },
            };
        default:
            return state;
    }
};
