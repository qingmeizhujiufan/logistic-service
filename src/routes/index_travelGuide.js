import React from 'react';
import { Route } from 'react-router';

/* 出行指南 */ 
import SegmentedNavigation from '../modules/travelGuide/segmentedNavigation/component/';
import BusInformation from '../modules/travelGuide/busInformation/component/';
import EntertainmentNavigation from '../modules/travelGuide/entertainmentNavigation/component/';
import LiveList from '../modules/travelGuide/live/component/';
import LiveDetail from '../modules/travelGuide/live/component/detail';

module.exports = ([
	<route path="travelGuide/segmentedNavigation" key='2_1' component={SegmentedNavigation} />,
    <route path="travelGuide/busInformation" key='2_2' component={BusInformation} />,
    <route path="travelGuide/entertainmentNavigation" key='2_3' component={EntertainmentNavigation} />,
    <route path="live/liveList" key='2_4' component={LiveList} />,
    <route path="live/detail/:id" key='2_5' component={LiveDetail} />,
]);