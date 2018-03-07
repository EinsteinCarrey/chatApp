import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/homepage';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from "react-redux";
import store from "./store";

const connectedComponents =
    <Provider store={store}>
        <App />
    </Provider>;

ReactDOM.render(connectedComponents, document.getElementById('root'));
registerServiceWorker();
