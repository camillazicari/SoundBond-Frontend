// const initialState = {
//     artists: [],
//     tracks: [],
//     genres: [],
//     favTrack: null,
//     user: null,
//     usersData: {},
// };
// const userReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'SIGNUP_USER': {
//             const newUser = {
//                 username: action.payload.username,
//                 password: action.payload.password,
//                 firstName: action.payload.firstName,
//                 lastName: action.payload.lastName,
//                 artists: action.payload.artists || [],
//                 tracks: action.payload.tracks || [],
//                 genres: action.payload.genres || [],
//                 favTrack: action.payload.favTrack || null
//             };

//             const newUsersData = {
//                 ...state.usersData,
//                 [action.payload.id]: newUser
//             };


//             return {
//                 ...state,
//                 usersData: newUsersData,
//                 user: {
//                     id: action.payload.id,
//                     username: action.payload.username,
//                     firstName: action.payload.firstName,
//                     lastName: action.payload.lastName
//                 },
//                 artists: newUser.artists,
//                 tracks: newUser.tracks,
//                 genres: newUser.genres,
//                 favTrack: newUser.favTrack
//             };
//         }

//         case 'LOGIN_USER': {
//             const user = state.usersData[action.payload.id];
//             if (user && user.password === action.payload.password) {
//                 return {
//                     ...state,
//                     user: {
//                         id: action.payload.id,
//                         username: user.username,
//                         firstName: user.firstName,
//                         lastName: user.lastName
//                     },
//                     artists: user.artists,
//                     tracks: user.tracks,
//                     genres: user.genres
//                 };
//             } else {
//                 alert('Username o password errati.');
//                 return state;
//             }
//         }
//         case 'LOGOUT_USER':
//             return {
//                 ...state,
//                 user: null,
//                 artists: [],
//                 tracks: [],
//                 genres: [],
//             };
//         case 'SET_ARTISTS':
//             return {
//                 ...state,
//                 artists: action.payload,
//                 usersData: {
//                     ...state.usersData,
//                     [state.user.id]: {
//                         ...state.usersData[state.user.id],
//                         artists: action.payload
//                     }
//                 }
//             };
//         case 'SET_TRACKS':
//             return {
//                 ...state,
//                 tracks: action.payload,
//                 usersData: {
//                     ...state.usersData,
//                     [state.user.id]: {
//                         ...state.usersData[state.user.id],
//                         tracks: action.payload
//                     }
//                 }
//             };

//         case 'SET_GENRES':
//             return {
//                 ...state,
//                 genres: action.payload,
//                 usersData: {
//                     ...state.usersData,
//                     [state.user.id]: {
//                         ...state.usersData[state.user.id],
//                         genres: action.payload
//                     }
//                 }
//             };

//         case 'SET_FAV_TRACK':
//             return {
//                 ...state,
//                 favTrack: action.payload,
//                 usersData: {
//                     ...state.usersData,
//                     [state.user.id]: {
//                         ...state.usersData[state.user.id],
//                         favTrack: action.payload
//                     }
//                 }
//             };
//         default:
//             return state;
//     }
// };

// export default userReducer;
