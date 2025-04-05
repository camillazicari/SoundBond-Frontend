const initialState = {
  artistiError: "",
  artisti: [],
};

const artistiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ARTISTI_ERROR":
      return {
        ...state,
        artistiError: action.payload,
      };

    case "GET_ARTISTI":
      return {
        ...state,
        artisti: action.payload,
      };

    default:
      return state;
  }
};

export default artistiReducer;
