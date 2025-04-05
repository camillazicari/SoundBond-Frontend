import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "../reducers/accountReducer";

const mainReducer = combineReducers({
    account: accountReducer,
});

const store = configureStore({
    reducer: mainReducer,
});

export default store;