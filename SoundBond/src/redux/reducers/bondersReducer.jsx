const initialState = {
  bondersError: "",
  bonders: [],
};

const bondersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "BONDERS_ERROR":
      return {
        ...state,
        bondersError: action.payload,
      };

    case "GET_BONDERS":
      return {
        ...state,
        bonders: action.payload,
      };

    default:
      return state;
  }
};

export default bondersReducer;
