import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import configureStore from './reducers'

let store = createStore(configureStore);
import {URL_HOME_PORTAL} from 'RestUrl';
import routes from 'routes/index';
import './index.less';//全局样式
import './assets/css/iconfont.css';

ReactDOM.render(
	<Provider store={store}>
    	<Router history={hashHistory} routes={routes}/>
    </Provider>, window.document.getElementById('main')
);