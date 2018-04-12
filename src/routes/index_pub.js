import React from 'react';
import { Route } from 'react-router';

/* 公共页面 */
//满意度调查
import Survey from '../modules/pub/survey/component/';
//公司官网
import CompanyWebsite from '../modules/pub/companyWebsite/component/';
//企业文化
import BusinessCulture from '../modules/pub/businessCulture/component/';
//节日活动
import Holidays from '../modules/pub/holidays/component/';
//企业相册
import EnterpriseAlbum from '../modules/pub/enterpriseAlbum/component/';
//食堂画面
import CanteenPicture from '../modules/pub/canteenPicture/component/';
//失物招领
import Lost from '../modules/pub/lost/component/';
//健康饮食
import HealthFood from '../modules/pub/healthFood/component/';
import HealthFoodDetail from '../modules/pub/healthFood/component/healthFoodDetail';

module.exports = ([
	<route path="pub/survey/:id" key='3_1' component={Survey} />,
    <route path="pub/companyWebsite/:id" key='3_2' component={CompanyWebsite} />,
    <route path="pub/businessCulture/:id" key='3_3' component={BusinessCulture} />,
    <route path="pub/holidays/:id" key='3_4' component={Holidays} />,
    <route path="pub/enterpriseAlbum/:id" key='3_5' component={EnterpriseAlbum} />,
    <route path="pub/canteenPicture/:id" key='3_6' component={CanteenPicture} />,
    <route path="pub/lost/:id" key='3_7' component={Lost} />,
    <route path="pub/healthFood/:id" key='3_8' component={HealthFood} />,
    <route path="pub/healthFood/detail/:id/:subId" key='3_9' component={HealthFoodDetail} />
]);