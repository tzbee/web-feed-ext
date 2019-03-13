import './index.scss';
import 'font-awesome/css/font-awesome.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';

import thunk from 'redux-thunk';

import App from './components/App/App';
import appReducer from './reducers/appReducer';

import { setCommands, setFeedList } from './actions';

const { Provider } = ReactRedux;
const { createStore, applyMiddleware } = Redux;

/*
    Set up the incoming message handler
*/
chrome.runtime.onMessage.addListener(({ command, commands, feeds }) => {
    switch (command) {
        case 'LOAD_COMMANDS:RESPONSE':
            store.dispatch(setCommands(commands));
            break;
        case 'FEEDS':
            store.dispatch(setFeedList(feeds));
            break;
        default:
            break;
    }
});

/*
    Create the redux store and render the app
*/

const store = createStore(appReducer, applyMiddleware(thunk));

chrome.runtime.sendMessage({ command: 'LOAD_COMMANDS' });
chrome.runtime.sendMessage({ command: 'LOAD_FEEDS' });

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
