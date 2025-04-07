const initialState = {
  logout: false,
  isLoginError: "",
  isRegisterError: "",
  users: [],
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
      };

    case "LOGOUT":
      return {
        ...state,
        loginSuccess: false,
        userLogged: null,
        logout: action.payload,
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
