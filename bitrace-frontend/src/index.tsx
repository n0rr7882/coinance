import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './App';
import LoginFormStore from './stores/forms/login';

const stores = {
    loginForm: new LoginFormStore(),
}

const root = (
    <Provider {...stores}>
        <App />
    </Provider>
);

ReactDOM.render(root, document.getElementById('root'));
