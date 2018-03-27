/* 
 *  create by zhongzheng in 2018/3/27.
 */ 

import React from 'react';
import {Route, IndexRoute,IndexRedirect} from 'react-router';

import App from '../modules/App';

/* 首页 */
import home from '../modules/home/component/home';

/* 就餐服务 */ 

/* 宿舍公寓 */ 

/* 出行指南 */ 

        // <route path="device/index" component={IndexDevice} />
module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={home}/>
    </Route>
);
