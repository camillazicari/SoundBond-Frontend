import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../reducers/accountReducer";
import generiReducer from "../reducers/generiReducer";
import artistiReducer from "../reducers/artistiReducer";
import braniReducer from "../reducers/braniReducer";
import profiloReducer from "../reducers/profiloReducer";

const mainReducer = combineReducers({
    account: accountReducer,
    generi: generiReducer,
    artisti: artistiReducer,
    brani: braniReducer,
    profilo: profiloReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;