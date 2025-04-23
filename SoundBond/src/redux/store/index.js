import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../reducers/accountReducer";
import generiReducer from "../reducers/generiReducer";
import artistiReducer from "../reducers/artistiReducer";
import braniReducer from "../reducers/braniReducer";
import profiloReducer from "../reducers/profiloReducer";
import richiesteReducer from "../reducers/richiesteReducer";
import bondersReducer from "../reducers/bondersReducer";
import conversazioniReducer from "../reducers/chatReducer";
import recensioniReducer from "../reducers/recensioniReducer";

const mainReducer = combineReducers({
    account: accountReducer,
    generi: generiReducer,
    artisti: artistiReducer,
    brani: braniReducer,
    profilo: profiloReducer,
    richieste: richiesteReducer,
    bonders: bondersReducer,
    conversazioni: conversazioniReducer,
    recensioni: recensioniReducer
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;