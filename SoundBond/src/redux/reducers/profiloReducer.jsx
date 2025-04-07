const initialState = {
  profilo: [],
};

const profiloReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_PROFILO":
      return {
        ...state,
        profilo: action.payload,
      };

    default:
      return state;
  }
};

export default profiloReducer;
