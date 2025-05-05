const initialState = {
  logout: false,
  isLoginError: "",
  isRegisterError: "",
  users: [],
  allUsers: [],
  user: null,
  userLogged: null,
  loginSuccess: false,
};

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_ERROR":
      return {
        ...state,
        loginSuccess: false,
        isLoginError: action.payload,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loginSuccess: action.payload,
        logout: false,
        isLoginError: "",
      };

    case "LOGOUT":
      return {
        ...initialState,
        logout: true,
      };

    case "REGISTER_ERROR":
      return {
        ...state,
        isRegisterError: action.payload,
      };

    case "GET_USERS":
      return {
        ...state,
        users: action.payload,
      };

    case "GET_ALL_USERS":
      return {
        ...state,
        allUsers: action.payload,
      };

    case "GET_USER_LOGGED":
      return {
        ...state,
        userLogged: action.payload,
      };

    default:
      return state;
  }
};

export default accountReducer;
