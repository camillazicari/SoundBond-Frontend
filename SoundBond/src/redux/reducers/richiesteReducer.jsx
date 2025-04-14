const initialState = {
  richiesteError: "",
  richiesteRicevute: [],
  richiesteInviate: [],
};

const richiesteReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RICHIESTE_ERROR":
      return {
        ...state,
        richiesteError: action.payload,
      };

    case "GET_RICHIESTE_RICEVUTE":
      return {
        ...state,
        richiesteRicevute: action.payload,
      };
    case "GET_RICHIESTE_INVIATE":
      return {
        ...state,
        richiesteInviate: action.payload,
      };

    case "ADD_RICHIESTA_INVIATA_OTTIMISTIC":
      return {
        ...state,
        richiesteInviate: [...state.richiesteInviate, action.payload],
      };

    case "REMOVE_RICHIESTA_INVIATA_OTTIMISTIC":
      return {
        ...state,
        richiesteInviate: state.richiesteInviate.filter(
          (req) => req.receiver.id !== action.payload
        ),
      };

    case "LOGOUT": {
      return initialState;
    }

    default:
      return state;
  }
};

export default richiesteReducer;
