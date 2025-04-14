const initialState = {
  braniError: "",
  brani: [],
};

const braniReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BRANI_ERROR":
      return {
        ...state,
        braniError: action.payload,
      };

    case "GET_BRANI":
      return {
        ...state,
        brani: action.payload,
      };

    case "LOGOUT": {
      return initialState;
    }

    default:
      return state;
  }
};

export default braniReducer;
