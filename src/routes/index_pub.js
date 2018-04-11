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
	<route path="pub/survey/:id" component={Survey} />,
    <route path="pub/companyWebsite/:id" component={CompanyWebsite} />,
    <route path="pub/businessCulture/:id" component={BusinessCulture} />,
    <route path="pub/holidays/:id" component={Holidays} />,
    <route path="pub/enterpriseAlbum/:id" component={EnterpriseAlbum} />,
    <route path="pub/canteenPicture/:id" component={CanteenPicture} />,
    <route path="pub/lost/:id" component={Lost} />,
    <route path="pub/healthFood/:id" component={HealthFood} />,
    <route path="pub/healthFood/detail/:id/:subId" component={HealthFoodDetail} />
]);