import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, TextareaItem, Picker, Toast} from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../deviceHire.less'; 
/* 引入参照 */ 
import DeviceRef from '../../../pub/refs/component/deviceRef';

let deviceUrl = MODULE_URL.DEVCONT_BASEHOST + "/device_rent/isExistRent/"; 
let billCodeUrl = MODULE_URL.DEVCONT_BASEHOST + "/getbc/DR01";
let saveBillUrl = MODULE_URL.DEVCONT_BASEHOST + "/device_devrent/saveBill";
let doSubmitUrl = MODULE_URL.DEVCONT_BASEHOST + "/device_rent/doSubmit";

//获取当前时间
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceHireAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      data: {
        examId: authToken.getStaff(),
      }, 
      deviceInfo: {},
      time: {
        reportTime: now,   
      }, 
      isShowDeviceRef: false, 
      infoData: {},
      bill:{},
      bill:{},
      hireCompId: {},
      submitData:{},
      msgData: {},
      value:'',
      backMsgHire:''
    }; 
    this.submitDeviceRef = this.submitDeviceRef.bind(this);
  }

  //初次渲染之前请求数据
  componentWillMount() { 
    ajax.getJSON(
      billCodeUrl, 
      null,
      data => {
        this.setState({
          datacode: data.backData
        });  
      } 
    ); 
  }

  componentDidMount() {  
  }

  //打开设备参照
  openDeviceRef = () => {
    this.setState({isShowDeviceRef: true}, () => {
      console.log('openDeviceRef isShowDeviceRef == ', this.state.isShowDeviceRef);
    }); 
  }

  //打开人员参照
  openPsnRef = () => {
    this.setState({isShowDeviceRef: true}, () => {
      console.log('openDeviceRef isShowDeviceRef == ', this.state.isShowDeviceRef);
    }); 
  }

  //回调设备参照返回的值
  submitDeviceRef = (deviceInfo, type) => {
    switch(type){
      case 'open': 
        console.log('deviceInfo == ', deviceInfo);
        let { data, checkTypeInfo } = this.state; 
        data.mgNo = {
          code: deviceInfo.name,
          id: deviceInfo.id,
          name: deviceInfo.code
        };
        data.devName = deviceInfo.name;
        data.devId = deviceInfo.devId;
        data.devModel = deviceInfo.devModel;
        data.devNo = deviceInfo.devNo;
        data.spotId = deviceInfo.id;
        data.contractName = deviceInfo.contractName;
        data.contractId = deviceInfo.contractId;
        data.supplierId = deviceInfo.hireCompId;
        data.supplierName = deviceInfo.hireComp;
        this.setState({
          data: data,
          deviceInfo: deviceInfo,
          isShowDeviceRef: false
        }); 
        ajax.getJSON(
          deviceUrl+deviceInfo.id+'/null',  
          null,
          data => {
            if(data.backMsg != null){ 
                Toast.info(data.backMsg);
                this.setState({
                  backMsgHire:data.backMsg
                })
                return;
            }
          } 
        );
      case 'close': 
        this.setState({
          isShowDeviceRef: false
        });
      default: ;
    }
    
  }

  //提交
  saveData = (deviceInfo) => { 
    let infoData = this.state.infoData;
    let time = this.state.time;  
    if(this.state.backMsgHire != null || this.state.backMsgHire !=''){
        Toast.info(this.state.backMsgHire);
        return;
    }
    if(!deviceInfo.code) {
        Toast.fail('请选择编号');
        return;
    }
    if(this.state.value == null || this.state.value == '') {
        Toast.fail('请填写情况描述');
        return;
    }  
    infoData.billCode = this.state.datacode.code;
    infoData.billState = 0;
    infoData.billType = 'DR01'; 
    infoData.companyId = authToken.getOrgaId();
    infoData.companyName = authToken.getOrgaName();
    infoData.contractName = deviceInfo.contractName;
    infoData.createtime = new Date().getTime();
    infoData.creator = authToken.getUserName();
    infoData.creatorid = authToken.getUserId();
    infoData.devModel = deviceInfo.devModel;
    infoData.devName = deviceInfo.name;
    infoData.devType = '0'; 
    infoData.memo = this.state.value;
    infoData.mgNo = deviceInfo.code;
    infoData.modifierid = authToken.getUserId();
    infoData.modifier = authToken.getUserName();
    infoData.pjtId = deviceInfo.pjtId;
    infoData.pjtName = deviceInfo.pjtName;
    infoData.spotId = deviceInfo.id;
    infoData.startTime = new Date(time.reportTime).getTime();
    infoData.stateType = deviceInfo.state=== 2? 3:2;
    infoData.providerId = null;
    infoData.providerName = null;
      let hireCompId = this.state.hireCompId;
      hireCompId.id = deviceInfo.hireCompId;
      hireCompId.name = deviceInfo.hireComp;
    infoData.hireCompId = hireCompId;
    console.log(infoData);
    
    ajax.postJSON(
      saveBillUrl,  
      JSON.stringify(infoData),
      data => {  
        Toast.info(data.backMsg);
        this.state.msgData = data.backData; 
        let msgData = this.state.msgData;
        let bill = this.state.bill; 
          bill.billCode = msgData.billCode;
          bill.billState = msgData.billState;
          bill.billStateName = msgData.billStateName;
          bill.billType = msgData.billType;
          bill.canModify = msgData.canModify;
          bill.companyId = authToken.getOrgaId();
          bill.createtime = msgData.createtime;
          bill.creator = msgData.creator;
          bill.creatorid = msgData.creatorid;
          bill.devType = msgData.devType;
          bill.id = msgData.id;
          bill.isActive = msgData.isActive;
          bill.istemp = msgData.istemp;
          bill.modifier = msgData.modifier;
          bill.modifierid = msgData.modifierid;
          bill.modifytime = msgData.modifytime;
          bill.pjtId = msgData.pjtId;
          bill.pjtName = msgData.pjtName;
          bill.pjtName = msgData.providerId;
          bill.pjtName = msgData.providerName;
          bill.spotId = msgData.spotId;
          //bill.startTime = new Date(msgData.startTime).getTime();
          bill.stateType = msgData.stateType;  
            hireCompId.code = msgData.hireCompId.code;
            hireCompId.id = msgData.hireCompId.id;
            hireCompId.name = msgData.hireCompId.name;
            hireCompId.parentId = msgData.hireCompId.parentId;
          bill.hireCompId = hireCompId;
        let submitData = this.state.submitData;
        submitData.bill = bill;
        submitData.billCode = msgData.billCode;
        submitData.billtypeId = msgData.billType;
        submitData.businessKey = msgData.id; 
        submitData.cbiztypeId = '1';
        submitData.formurl = "http://test.cscec3b.com.cn/icop-devcont-frontend/#/DevRent/edit/"+msgData.id;
        submitData.procInstName = "设备启停租"+'['+msgData.billCode+']';
        submitData.userId =  authToken.getUserId();
        console.log(submitData)
        //提交
        ajax.postJSON(
        doSubmitUrl, 
        JSON.stringify(submitData),
        data => {
            if(data.success) {
              console.log(data);
              this.context.router.goBack();
            } 
          } 
        ); 
      } 
    );   
  }

  //返回
  callback = () =>{
    this.context.router.goBack();
  }
  
  render() { 
     const { deviceInfo, isShowDeviceRef, value, time} = this.state; 
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
            <div onClick={ () => {
                this.saveData(deviceInfo); 
              }}>确定</div>
            }
          >新增设备启停租单</NavBar>
        <div className='zui-content'>
          <div className="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <List.Item extra={deviceInfo.code ? deviceInfo.code : '请选择'} arrow="horizontal" onClick={this.openDeviceRef} thumb={<span className="icon-device icon-device-equipmentNO"></span>}>设备管理编号</List.Item>
                  <List.Item extra={deviceInfo.name} thumb={<span className="icon-device icon-device-equipment"></span>}>设备名称</List.Item>
                  <List.Item extra={deviceInfo.devModel} thumb={<span className="icon-device icon-device-equipmentType"></span>}>设备型号</List.Item>
                  <List.Item extra={deviceInfo.pjtName} thumb={<span className="icon-device icon-device-project"></span>}>项目名称</List.Item>
                  <List.Item extra={deviceInfo.contractName} thumb={<span className="icon-device icon-device-contract"></span>}>合同名称</List.Item> 
                  <List.Item extra={deviceInfo.hireComp} thumb={<span className="icon-device icon-device-inDate"></span>}>出租单位</List.Item> 
                </List>
              </Accordion.Panel>
            </Accordion> 
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>启停租信息</h2>
            </div>
            <List className="my-list" style={{marginTop:'10px'}}>
                  <List.Item extra={deviceInfo.tate ===2 ? '停租' : '启租'}>启停租</List.Item>  
                   <DatePicker
                    mode="date"
                    title=""
                    extra="请选择"
                    value={time.reportTime}
                    onChange={
                      (date) => {
                        time.reportTime = date;
                        this.setState({ time:  time});
                      }
                    }
                   >
                     <List.Item arrow="horizontal">执行时间</List.Item>
                   </DatePicker>
                   <List.Item >情况描述
                    <TextareaItem  
                        autoHeight
                        labelNumber={5}
                        placeholder='请输入'
                        onChange={
                          (value) => {  
                            this.setState({ value:  value});
                          }
                        }
                    />
                   </List.Item>
            </List>
          </div>  
        </div>
         <DeviceRef submitDeviceRef={ this.submitDeviceRef } isShowDeviceRef={ isShowDeviceRef } />
      </div>
    );
  }
};

DeviceHireAdd.contextTypes = {  
     router:React.PropTypes.object  
}  
export default DeviceHireAdd;
