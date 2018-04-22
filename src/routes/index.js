/* 
 *  create by zhongzheng in 2018/3/27.
 */ 

import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from '../modules/App';

/* 首页 */
import Home from '../modules/home/component/home';

/* 就餐服务 */
import DiningService from './index_diningService';

/* 宿舍公寓 */ 
import Residence from './index_residence';

/* 出行指南 */ 
import TravelGuide from './index_travelGuide';

/* 公共页面 */
import Pub from './index_pub';

const groupRouters = [
    <IndexRoute key='0' component={Home}/>,
    ...DiningService,
    ...Residence,
    ...TravelGuide,
    ...Pub
];

console.log('groupRouters ==== ', groupRouters);

module.exports = (
    <Route path="/" component={App}>
        {groupRouters}
    </Route>
);
