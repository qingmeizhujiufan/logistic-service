import React from 'react';
import {Route, IndexRoute,IndexRedirect} from 'react-router';

import App from '../modules/App';

/* 公共首页 */
import Index from '../modules/pub/index/component/index';

/* 设备项目部
 *  create by zhongzheng
 */ 
/* 设备项目部首页 */ 
import IndexDevice from '../modules/device/index/component/index';
/* 合同台账 */ 
import ContractLedgerList from '../modules/device/contractLedger/component/contractLedgerList';
import ContractLedgerDetail from '../modules/device/contractLedger/component/contractLedgerDetail';
/* 进场通知 */ 
import DeviceApproachNoticeList from '../modules/device/deviceApproachNotice/component/deviceApproachNoticeList';
import DeviceApproachNoticeDetail from '../modules/device/deviceApproachNotice/component/deviceApproachNoticeDetail';
import DeviceApproachNoticeAdd from '../modules/device/deviceApproachNotice/component/deviceApproachNoticeAdd';
/* 进场验收 */ 
import DeviceAcceptList from '../modules/device/deviceAccept/component/deviceAcceptList';
import DeviceAcceptDetail from '../modules/device/deviceAccept/component/deviceAcceptDetail';
import DeviceAcceptAdd from '../modules/device/deviceAccept/component/deviceAcceptAdd';
/* 设备启停租 */ 
import DeviceHireList from '../modules/device/deviceHire/component/deviceHireList';
import DeviceHireDetail from '../modules/device/deviceHire/component/deviceHireDetail';
import DeviceHireAdd from '../modules/device/deviceHire/component/deviceHireAdd';
/* 设备检查 */ 
import DeviceCheckList from '../modules/device/deviceCheck/component/deviceCheckList';
import DeviceCheckDetail from '../modules/device/deviceCheck/component/deviceCheckDetail';
import DeviceCheckAdd from '../modules/device/deviceCheck/component/deviceCheckAdd';
/* 设备检查(无供方) */ 
import DeviceCheckListNoProvider from '../modules/device/deviceCheck/component/deviceCheckListNoProvider';
import DeviceCheckDetailNoProvider from '../modules/device/deviceCheck/component/deviceCheckDetailNoProvider';
import DeviceCheckAddNoProvider from '../modules/device/deviceCheck/component/deviceCheckAddNoProvider';
/* 关键作业*/
import KeyWorkList from '../modules/device/keyWork/component/keyWorkList';
import KeyWorkDetail from '../modules/device/keyWork/component/keyWorkDetail';
import KeyWorkInfo from '../modules/device/keyWork/component/keyWorkInfo';
/* 设备维修*/
import DeviceServiceList from '../modules/device/deviceService/component/deviceServiceList';
import DeviceServiceDetail from '../modules/device/deviceService/component/deviceServiceDetail';
import DeviceServiceAdd from '../modules/device/deviceService/component/deviceServiceAdd';
/* 单机档案  */
import DeviceRecordList from '../modules/device/deviceRecord/component/deviceRecordList';
import DeviceMessage from '../modules/device/deviceRecord/component/deviceMessage';
/* 设备保养 */ 
import DeviceMaintenanceList from '../modules/device/deviceMaintenance/component/deviceMaintenanceList';
import DeviceMaintenanceDetail from '../modules/device/deviceMaintenance/component/deviceMaintenanceDetail';
/* 设备运转 */ 
import DeviceRunList from '../modules/device/deviceRun/component/deviceRunList';
import DeviceCalendar from '../modules/device/deviceRun/component/deviceCalendar';
import DeviceHandover from '../modules/device/deviceRun/component/deviceHandover';
import DeviceRunDetail from '../modules/device/deviceRun/component/deviceRunDetail';
import DeviceHandoverRecord from '../modules/device/deviceRun/component/deviceHandoverRecord';
/* 扫一扫 */ 
import DeviceScanDetail from '../modules/device/deviceScan/component/deviceScanDetail';
/* 设备供应商
 *  create by zhousisi
 */ 
/* 设备供应商首页 */ 
import IndexProvider from '../modules/deviceProvider/index/component/index';
/* 进场备货 */ 
import DeviceProviderApproachNoticeList from '../modules/deviceProvider/deviceApproachNotice/component/deviceApproachNoticeList';
import DeviceProviderApproachNoticeDetail from '../modules/deviceProvider/deviceApproachNotice/component/deviceApproachNoticeDetail';
/* 设备整改 */ 
import DeviceSupplierList from '../modules/deviceProvider/deviceSupplier/component/deviceSupplierList';
import DeviceSupplierDetails from '../modules/deviceProvider/deviceSupplier/component/deviceSupplierDetails';
/* 设备维修 */ 
import DeviceProviderServiceList from '../modules/deviceProvider/deviceService/component/deviceServiceList';
import DeviceProviderRepairsDetail from '../modules/deviceProvider/deviceService/component/deviceRepairsDetail';
import DeviceProviderRepairsAdd from '../modules/deviceProvider/deviceService/component/deviceRepairsAdd';
import DeviceProviderServiceLog from '../modules/deviceProvider/deviceService/component/deviceServiceLog';
/* 设备保养 */ 
import DeviceProviderMaintenanceList from '../modules/deviceProvider/deviceMaintenance/component/deviceMaintenanceList';
import DeviceProviderMaintenanceDetail from '../modules/deviceProvider/deviceMaintenance/component/deviceMaintenanceDetail';
import DeviceProviderMaintenanceAdd from '../modules/deviceProvider/deviceMaintenance/component/deviceMaintenanceAdd';
/* 设备运转 */ 
import DeviceProviderRunList from '../modules/deviceProvider/deviceRun/component/deviceRunList';
import DeviceProviderRunDetail from '../modules/deviceProvider/deviceRun/component/deviceRunDetail';
import DeviceProviderHandover from '../modules/deviceProvider/deviceRun/component/deviceHandover';
import DeviceProviderRunAdd from '../modules/deviceProvider/deviceRun/component/deviceRunAdd';
import DeviceProviderHandoverRecord from '../modules/deviceProvider/deviceRun/component/deviceHandoverRecord';

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={Index}/>
        <route path="device/index" component={IndexDevice} />
        <route path="device/contractLedgerList" component={ContractLedgerList} />
        <route path="device/contractLedgerDetail/:id" component={ContractLedgerDetail} />
        <route path="device/deviceApproachNoticeList" component={DeviceApproachNoticeList} />
        <route path="device/deviceApproachNoticeDetail/:id" component={DeviceApproachNoticeDetail} />
        <route path="device/deviceApproachNoticeAdd/:id/:devid" component={DeviceApproachNoticeAdd} />
        <route path="device/deviceAcceptList" component={DeviceAcceptList} />
        <route path="device/deviceAcceptDetail/:id" component={DeviceAcceptDetail} />
        <route path="device/deviceAcceptAdd/:id" component={DeviceAcceptAdd} />
        <route path="device/deviceHireList" component={DeviceHireList} />
        <route path="device/deviceHireDetail/:id" component={DeviceHireDetail} />
        <route path="device/deviceHireAdd/" component={DeviceHireAdd} />
        <route path="device/deviceCheckList" component={DeviceCheckList} />
        <route path="device/deviceCheckDetail/:id" component={DeviceCheckDetail} />
        <route path="device/deviceCheckAdd" component={DeviceCheckAdd} />
        <route path="device/deviceCheckListNoProvider" component={DeviceCheckListNoProvider} />
        <route path="device/deviceCheckDetailNoProvider/:id" component={DeviceCheckDetailNoProvider} />
        <route path="device/deviceCheckAddNoProvider" component={DeviceCheckAddNoProvider} />
        <route path="device/keyWorkList" component={KeyWorkList} />
        <route path="device/keyWorkDetail/:id" component={KeyWorkDetail} />
        <route path="device/keyWorkInfo/:id" component={KeyWorkInfo} />
        <route path="device/deviceServiceList" component={DeviceServiceList} />
        <route path="device/deviceServiceDetail/:id" component={DeviceServiceDetail} />
        <route path="device/deviceServiceAdd/" component={DeviceServiceAdd} />
        <route path="device/deviceRecordList" component={DeviceRecordList} />
        <route path="device/deviceMessage/:id" component={DeviceMessage} />
        <route path="device/deviceMaintenanceList" component={DeviceMaintenanceList} />
        <route path="device/deviceMaintenanceDetail/:id" component={DeviceMaintenanceDetail} />
        <route path="device/deviceRunList" component={DeviceRunList} />
        <route path="device/deviceCalendar/:id" component={DeviceCalendar} />
        <route path="device/deviceHandover/:id" component={DeviceHandover} />
        <route path="device/deviceRunDetail/:id/:date" component={DeviceRunDetail} />
        <route path="device/deviceHandoverRecord/:id/:day" component={DeviceHandoverRecord} />
        <route path="device/deviceScanDetail" component={DeviceScanDetail} />

        <route path="deviceProvider/index" component={IndexProvider} />
		<route path="deviceProvider/deviceApproachNoticeList" component={DeviceProviderApproachNoticeList} />
		<route path="deviceProvider/deviceApproachNoticeDetail/:id" component={DeviceProviderApproachNoticeDetail} />
		<route path="deviceProvider/deviceSupplierList" component={DeviceSupplierList} />
		<route path="deviceProvider/deviceSupplierDetails/:id" component={DeviceSupplierDetails} />
		<route path="deviceProvider/deviceServiceList" component={DeviceProviderServiceList} />
		<route path="deviceProvider/deviceRepairsDetail/:id" component={DeviceProviderRepairsDetail} />
		<route path="deviceProvider/deviceRepairsAdd" component={DeviceProviderRepairsAdd} />
		<route path="deviceProvider/deviceServiceLog/:id" component={DeviceProviderServiceLog} />
		<route path="deviceProvider/deviceMaintenanceList" component={DeviceProviderMaintenanceList} />
		<route path="deviceProvider/deviceMaintenanceDetail/:id" component={DeviceProviderMaintenanceDetail} />
		<route path="deviceProvider/deviceMaintenanceAdd" component={DeviceProviderMaintenanceAdd} />
		<route path="deviceProvider/deviceRunList" component={DeviceProviderRunList} />
		<route path="deviceProvider/deviceRunDetail/:id" component={DeviceProviderRunDetail} />
		<route path="deviceProvider/deviceHandover/:id" component={DeviceProviderHandover} />
		<route path="deviceProvider/deviceRunAdd/:id" component={DeviceProviderRunAdd} />
        <route path="deviceProvider/deviceHandoverRecord/:id/:day" component={DeviceProviderHandoverRecord} />
    </Route>
);
