import {createStore, applyMiddleware} from 'redux';
import combinedReducer from "../reducers";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from 'redux-thunk';

let middleware = applyMiddleware(thunk);

/* load with dev-tools extension */
if(process.env.NODE_ENV === 'development'){
    middleware = composeWithDevTools(middleware);
}

const store = createStore(combinedReducer, middleware);

export default store;