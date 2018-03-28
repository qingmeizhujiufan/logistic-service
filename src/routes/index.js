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
//满意度调查
import Survey from '../modules/pub/survey/component/survey';
//企业文化
import BusinessCulture from '../modules/pub/businessCulture/component/businessCulture';
//节日活动
import Holidays from '../modules/pub/holidays/component/holidays';
//企业相册
import EnterpriseAlbum from '../modules/pub/enterpriseAlbum/component/enterpriseAlbum';

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <route path="diningService/todayMenu" component={TodayMenu} />
        <route path="diningService/canteenPicture" component={CanteenPicture} />
        <route path="pub/survey" component={Survey} />
        <route path="pub/businessCulture" component={BusinessCulture} />
        <route path="pub/holidays" component={Holidays} />
        <route path="pub/enterpriseAlbum" component={EnterpriseAlbum} />
    </Route>
);
