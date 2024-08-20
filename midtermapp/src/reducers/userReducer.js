import { 
    ADD_USER_REQUEST, 
    ADD_USER_SUCCESS, 
    ADD_USER_FAILURE, 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    FETCH_ROLES_SUCCESS,
} from "../actions/userActions";

const initialState = {
    loading: false,
    user: null,
    userId: null, 
    error: null,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload.user, userId: action.payload.userId, error: null }; // Adjust based on response structure
        case LOGIN_FAILURE:
            return { ...state, loading: false, user: null, userId: null, error: action.error };
        case FETCH_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case FETCH_USER_FAILURE:
            return { ...state, loading: false, user: null, error: action.error };
        case FETCH_ROLES_SUCCESS:
            return { ...state, roles: action.payload };
        default:
            return state;
    }
};


export default userReducer;