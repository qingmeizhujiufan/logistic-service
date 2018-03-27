import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, TextareaItem, Picker, ImagePicker, Toast} from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../deviceService.less';
// import '../../../static/css/iconfont.css';
import Files from 'Utils/files';
/* 引入参照 */ 
import DeviceRef from '../../../pub/refs/component/deviceRef';
import PsnRef from '../../../pub/refs/component/psnRef';

let billCodeUrl = MODULE_URL.DEVCONT_BASEHOST + "/getbc/DM01";
let saveUrl = MODULE_URL.DEVCONT_BASEHOST + "/device_devmat/saveBill"; 
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceServiceAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      data: {
        examId: authToken.getStaff(),
        reportTime: now
      },  
      matType : 1,
      deviceInfo: {},
      isShowDeviceRef: false,
      isShowPsnRef:false, 
      serviceLevel: {
        value:1,
        label:'一级'
      },
      files: [],
      dataInfo:{}, 
      value:'',
      attachesList:[],
      itemData:{},
      psnName:'' 
    }; 
    this.submitDeviceRef = this.submitDeviceRef.bind(this);  
  }

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
    this.setState({
      psnName: this.state.data.examId.name
    })
  }
// 附件上传
  onFilesChange = (files, type, index) => { 
      const itemData = this.state.itemData;
      itemData.attachesList = this.state.files;
      console.log(itemData) 
      console.log(files, type, index);
      if(type === 'add'){
      let source = {}; 
      source.sourceId = null;
      source.sourceType = '102345678';
      Toast.loading('正在上传...', 0);
      Files.multiFilesUpLoad( 
        itemData,
        files,
        "DC01", 
        authToken, 
        source,
        (data) => {
          console.log('callback data === ', data);
          itemData.attachesList = data.attachesList;
          this.setState({
            itemData,
          });
          Toast.hide();
      })
    }else {
        let attachesList = itemData.attachesList;
        attachesList.splice(index, 1);
        itemData.attachesList = attachesList;
        this.setState({
          itemData,
        })
    }
  }
//打开设备参照
  openDeviceRef = () => { 
    console.log(this)
    this.setState({
      isShowDeviceRef: true,
      isShowPsnRef: false 
    }
    ); 
  }
//打开人员参照
  openPsnRef = () => {
    console.log(this)
    this.setState({
      isShowPsnRef: true,
      isShowDeviceRef: false, 
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
          isShowDeviceRef: false, 
        }); 
      case 'close':
        this.setState({
          isShowDeviceRef: false
        });
      default: ;
    }
    
  }
//回调人员参照返回的值
  submitPsnRef = (psnInfo, type) => {
    switch(type){
      case 'open':
        console.log('deviceInfo == ', psnInfo);  
        let psnName = this.state.psnName;
        console.log(psnName)
        this.setState({ 
          psnInfo: psnInfo, 
          psnName:psnInfo.name,
          isShowPsnRef: false, 
        }); 
      case 'close':
        this.setState({
          isShowPsnRef: false
        });
      default: ;
    }
    
  }

// 提交
  saveData = (deviceInfo) => { 
    console.log(deviceInfo);   
    console.log(this.state.datacode); 
    let data= this.state.data; 
    let itemData= this.state.itemData; 
    if(!deviceInfo.code) {
        Toast.fail('请选择编号');
        return;
      }
    if(data.reportTime == 0) {
        Toast.fail('请选择保修时间');
        return;
    }
    if(this.state.value == null || this.state.value == '') {
        Toast.fail('请填写报修内容');
        return;
    } 
    if(this.state.itemData.attachesList == null || this.state.itemData.attachesList == '') {
        Toast.fail('请上传附件');
        return;
    } 
    deviceInfo.billCode = this.state.datacode.code;
    deviceInfo.billType = 'DM01';
    deviceInfo.mgNo = deviceInfo.code;
    deviceInfo.devName = deviceInfo.name;
    deviceInfo.reportTime = new Date(data.reportTime).getTime();
    deviceInfo.creatorid = authToken.getUserId();
    deviceInfo.creator = authToken.getUserName();
    deviceInfo.modifierid = authToken.getUserId();
    deviceInfo.modifier = authToken.getUserName();
    deviceInfo.companyId = authToken.getOrgaId();
    deviceInfo.companyName = authToken.getOrgaName();
    deviceInfo.matLevel = this.state.serviceLevel.value;
    deviceInfo.reporterName = this.state.psnName;
    deviceInfo.hasReport = 2;
    deviceInfo.matType = 1;
    deviceInfo.progressState = 1;
    deviceInfo.billState = 0; //自由态
    deviceInfo.spotId = deviceInfo.id;
    deviceInfo.reportContent = this.state.value; //内容
    deviceInfo.id = null; 
    deviceInfo.reportUpload = itemData.attachesList.map(function(item, index) {
            return item.gid;
          }).join(',');
    console.log(deviceInfo);
    ajax.postJSON(
      saveUrl, 
      JSON.stringify(deviceInfo),
      data => {
        if(data.success) {
          console.log(data);
          this.context.router.goBack();
        } 
      } 
    );  
  }
// 返回
  callback = () =>{
    this.context.router.goBack();
  }
  render() { 
     const { psnName, value, data, deviceInfo, isShowDeviceRef, isShowPsnRef, serviceLevel, files, itemData} = this.state;
     const serviceLevelList = [
      {
        value: 1,
        label: '一级'
      }, {
        value: 2,
        label: '二级'
      }, {
        value: 3,
        label: '三级'
      }];
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
        >新增设备维修单</NavBar>
        <div className='zui-content zui-scroll-wrapper'>
          <div className = 'zui-scroll'>
            <Accordion defaultActiveKey="0" className="my-accordion">
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <List.Item extra={deviceInfo.code ? deviceInfo.code : '请选择'} arrow="horizontal" onClick={this.openDeviceRef} thumb={<span className="icon-device icon-device-equipmentNO"></span>}>设备管理编号</List.Item>
                  <List.Item extra={deviceInfo.name} thumb={<span className="icon-device icon-device-equipment"></span>}>设备名称</List.Item>
                  <List.Item extra={deviceInfo.devModel} thumb={<span className="icon-device icon-device-equipmentType"></span>}>设备型号</List.Item>
                  <List.Item extra={deviceInfo.pjtName} thumb={<span className="icon-device icon-device-project"></span>}>项目名称</List.Item>
                  <List.Item extra={deviceInfo.contractName} thumb={<span className="icon-device icon-device-contract"></span>}>合同名称</List.Item> 
                </List>
              </Accordion.Panel>
            </Accordion> 
            <List className="my-list" style={{marginTop:'10px'}}>
                  <List.Item extra={this.state.matType ==1 ? '维修' : ''}>维修类型</List.Item>
                  <Picker 
                    data={ serviceLevelList } 
                    cols={1}
                    extra="请选择"
                    value={ [serviceLevel.value] }
                    onChange={
                      (value) => {                  
                        console.log('Picker value == ', value[0]);
                        serviceLevel.value = value[0];
                        serviceLevelList.map(function(item, index){
                          if(item.value == serviceLevel.value){
                            serviceLevel.label = item.label;
                            return;
                          }
                        });
                        console.log('Picker serviceLevel == ', serviceLevel);
                        this.setState({ serviceLevel: serviceLevel });
                      }
                    }
                  >
                    <List.Item arrow="horizontal">维修等级</List.Item>
                  </Picker>
                  <List.Item extra={this.state.psnName} arrow="horizontal" onClick={this.openPsnRef}>报修人</List.Item>
                   <DatePicker
                    mode="datetime"
                    title="选择日期"
                    extra="请选择"
                    value={data.reportTime}
                    onChange={
                      (date) => {
                        data.reportTime = date;
                        this.setState({ data:  data});
                      }
                    }
                   >
                     <List.Item arrow="horizontal">报修时间</List.Item>
                   </DatePicker>
            </List>
            <List className="my-list" style={{marginTop:'10px'}}>
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
             <ImagePicker
                files={files}
                onChange={(files, type, index) => {
                  this.onFilesChange(files, type, index);
                }}
                onImageClick={(index, fs) => console.log(index, fs)}
                selectable={files.length < 5}
                onAddImageClick={this.onAddImageClick}
              />
            </List>
          </div>
        </div>
          <DeviceRef submitDeviceRef={ this.submitDeviceRef } isShowDeviceRef={ isShowDeviceRef } />
          <PsnRef submitPsnRef={ this.submitPsnRef } isShowPsnRef={ isShowPsnRef } />
      </div>
    );
  }
};

DeviceServiceAdd.contextTypes = {  
     router:React.PropTypes.object  
}  
export default DeviceServiceAdd;
