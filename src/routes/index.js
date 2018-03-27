/* 
 *  create by zhongzheng in 2018/3/27.
 */ 

import React from 'react';
import {Route, IndexRoute,IndexRedirect} from 'react-router';

import App from '../modules/App';

/* 首页 */
import Home from '../modules/home/component/home';

/* 就餐服务 */
import TodayMenu from '../modules/diningService/todayMenu/component/todayMenu';
import CanteenPicture from '../modules/diningService/canteenPicture/component/canteenPicture';

/* 宿舍公寓 */ 

/* 出行指南 */ 

/* 公共页面 */
import Survey from '../modules/pub/survey/component/survey';

        // <route path="device/index" component={IndexDevice} />
module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <route path="diningService/todayMenu" component={TodayMenu} />
        <route path="diningService/canteenPicture" component={CanteenPicture} />
        <route path="pub/survey" component={Survey} />
    </Route>
);
