import React from 'react';
import {Route} from 'react-router';

/* 宿舍公寓 */
import Residence from '../modules/residence/residence/component/';
import Ball from '../modules/residence/ball/component/';

module.exports = ([
    <route path="residence/residence/:id" key='4_1' component={Residence}/>,
    <route path="residence/ball/:id" key='4_2' component={Ball}/>
]);