import React from 'react';
import { Route } from 'react-router';

/* 出行指南 */ 
import SegmentedNavigation from '../modules/travelGuide/segmentedNavigation/component/';
import BusInformation from '../modules/travelGuide/busInformation/component/';
import EntertainmentNavigation from '../modules/travelGuide/entertainmentNavigation/component';

module.exports = ([
	<route path="travelGuide/segmentedNavigation" key='2_1' component={SegmentedNavigation} />,
    <route path="travelGuide/busInformation" key='2_2' component={BusInformation} />,
    <route path="travelGuide/entertainmentNavigation" key='2_3' component={EntertainmentNavigation} />
]);