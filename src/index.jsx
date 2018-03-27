import React from 'react';
import ReactDOM from 'react-dom';
import { Router, hashHistory } from 'react-router'
import AuthToken from 'Utils/authToken'
import {URL_HOME_PORTAL} from 'RestUrl'
import routes from 'routes/index'
import './index.less'//全局样式
import './assets/css/iconfont.css';

var portalOptions = {};
portalOptions.authentication = false;
portalOptions.success = function () {
    portalOptions.authentication = true;
    ReactDOM.render(
        <Router history={hashHistory} routes={routes}/>
        , window.document.getElementById('main')
    );
};
portalOptions.error = function () {
    window.setTimeout(function () {
        if (portalOptions.authentication === false) {
            window.location.href = URL_HOME_PORTAL;
        }
    }, 1000);
};
AuthToken.init(portalOptions);