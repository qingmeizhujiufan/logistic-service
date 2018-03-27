import React from 'react';
import {Route, IndexRoute,IndexRedirect} from 'react-router';

import App from '../modules/App';

/* 公共首页 */
import home from '../modules/home/component/home';

/* 设备项目部
 *  create by zhongzheng
 */ 
/* 设备项目部首页 */ 
import IndexDevice from '../modules/device/index/component/index';

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={home}/>
        <route path="device/index" component={IndexDevice} />
    </Route>
);
