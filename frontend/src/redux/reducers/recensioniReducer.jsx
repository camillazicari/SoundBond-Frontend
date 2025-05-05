const initialState = {
  recensioniError: "",
  recensioni: [],
  miaRecensione: null,
};

const recensioniReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECENSIONI_ERROR":
      return {
        ...state,
        recensioniError: action.payload,
      };

    case "GET_ALL_RECENSIONI":
      return {
        ...state,
        recensioni: action.payload,
      };

    case "GET_MIA_RECENSIONE":
      return {
        ...state,
        miaRecensione: action.payload,
      };

    case "DELETE_RECENSIONE":
      return {
        ...state,
        miaRecensione: null,
      };

    case "LOGOUT": {
      return initialState;
    }

    default:
      return state;
  }
};

export default recensioniReducer;
