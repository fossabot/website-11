import * as actions from '../actions/auth';

const defaultState = {
    loggedIn: false,
    tokens: null,
    attributes: null,
    loggingIn: false,
    error: null,
};

export default (state = defaultState, action) => {
    switch (action.type) {
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
        default:
            return state;
    }
};
