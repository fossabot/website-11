import * as actions from '../actions/auth';

const defaultState = {
    loggedIn: false,
    tokens: null,
    attributes: null,
    loggingIn: false,
    error: null,
    loading: false,
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
        case actions.LOGOUT_ERROR:
            return defaultState;
        default:
            return state;
    }
};
