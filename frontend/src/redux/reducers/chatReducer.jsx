const initialState = {
  conversazioni: [],
};

const conversazioniReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CONVERSAZIONI":
      return {
        ...state,
        conversazioni: action.payload,
      };

    case "LOGOUT": {
      return initialState;
    }

    default:
      return state;
  }
};

export default conversazioniReducer;
