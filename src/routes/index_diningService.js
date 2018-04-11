import React from 'react';
import { Route } from 'react-router';

/* 就餐服务 */ 
import TodayMenu from '../modules/diningService/todayMenu/component';

module.exports = ([
	<route path="diningService/todayMenu/:floor" component={TodayMenu} />
]);