const initialState = {
    preferences: [],
    tracks: [],
    user: null,
    usersData: {},
};
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SIGNUP_USER': {
            const newUsersData = {
                ...state.usersData,
                [action.payload.id]: {
                    username: action.payload.username,
                    password: action.payload.password,
                    email: action.payload.email,
                    firstName: action.payload.firstName,
                    lastName: action.payload.lastName,
                    preferences: action.payload.preferences || [],
                    tracks: action.payload.tracks || []
                }
            };
            console.log("Aggiornamento utenti registrati:", newUsersData);
            return {
                ...state,
                usersData: newUsersData
            };
        }

        case 'LOGIN_USER': {
            const user = state.usersData[action.payload.id];
            if (user && user.password === action.payload.password) {
                return {
                    ...state,
                    user: {
                        id: action.payload.id,
                        email: action.payload.email,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    },
                    preferences: user.preferences,
                    tracks: user.tracks
                };
            } else {
                alert('Username o password errati.');
                return state;
            }
        }
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null,
                preferences: [],
                tracks: []
            };
        case 'SET_PREFERENCES':
            return {
                ...state,
                preferences: action.payload,
                usersData: {
                    ...state.usersData,
                    [state.user.id]: {
                        ...state.usersData[state.user.id],
                        preferences: action.payload
                    }
                }
            };
        case 'SET_TRACKS':
            return {
                ...state,
                tracks: action.payload,
                usersData: {
                    ...state.usersData,
                    [state.user.id]: {
                        ...state.usersData[state.user.id],
                        tracks: action.payload
                    }
                }
            };
        default:
            return state;
    }
};

export default userReducer;
