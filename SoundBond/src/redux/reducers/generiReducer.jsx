const initialState = {
  generiError: "",
  generi: [],
};

const generiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GENERI_ERROR":
      return {
        ...state,
        generiError: action.payload,
      };

    case "GET_GENERI":
      return {
        ...state,
        generi: action.payload,
      };

    default:
      return state;
  }
};

export default generiReducer;
