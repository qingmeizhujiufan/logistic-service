import React from 'react';
import { NavBar, Icon, Button , Accordion, List ,DatePicker,Picker,TextareaItem,Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import DeviceRef from '../../../pub/refs/component/deviceRef';
import SpecialPsnRef from '../../../pub/refs/component/specialPsnRef';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/run/findById";
const runCharge = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/setAduitor";
const saveUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/run/saveBill";
const Item = List.Item;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceProviderHandoverRecord extends React.Component{
    constructor(props) {
    super(props);

    this.state = {
      data: {},
      datatime:{
        datetime:now,
        time:now
      },
      submitor:{},
      receiver:{},
      supId:'',
      isShowDeviceRef: false, 
      isShowSpecialPsnRef: false,
      matInfo: {
        value:1,
        label:'良好'
      },
      taskInfo:'',
      devInfo:'',
      driveTestInfo:'',
      attentions:'',
      memo:''
    };  

    this.submitDeviceRef = this.submitDeviceRef.bind(this); 
    this.submitSpecialPsnRef = this.submitSpecialPsnRef.bind(this); 
  }

  componentWillMount = ()=> {
    const param = {
      id: this.props.params.id
    }
    const runDay = this.props.params.day;
    ajax.getJSON(
      findByIdUrl,
      param,
      data => {
        if(data.success) { 
            var data = data.backData;  
            this.setState({
              data: data
            });
          }
      }
    );
  }
//打开设备参照
  openDeviceRef= ()=>{ 
    this.setState({
      isShowDeviceRef: true,  
    }); 
  } 
// 打开特种人员参照
  chooseReformPersonWindow= ()=>{ 
    this.setState({ 
      supId:authToken.getSupId(),
      isShowDeviceRef: false, 
      isShowSpecialPsnRef: true
    });
  } 
  //回调设备参照返回的值    
  submitDeviceRef= (deviceInfo, type)=>{
    switch(type){
      case 'open':
        console.log('deviceInfo == ', deviceInfo);
        let { data, checkTypeInfo } = this.state;
        data.code = deviceInfo.code;
        data.devName = deviceInfo.name  
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
// 回调特种人员参照返回的值
  submitSpecialPsnRef= (specialPsnInfo, type)=>{
    switch(type){
      case 'open':
        console.log('this',this)
        console.log('specialPsnInfo ====222=== ', specialPsnInfo);
        let { submitor, isShowSpecialPsnRef, receiver } = this.state;
        submitor.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        receiver.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        this.setState({
          receiver,
          submitor,
          isShowSpecialPsnRef: false
        });
      case 'close':
        this.setState({
          isShowSpecialPsnRef: false
        });
      default: ;
    }
    
  } 

  //点击确认事件
  runCharge=()=>{
     console.log(this.state.data);
     let data = this.state.data;
     let datatime = this.state.datatime;
     let submitor = this.state.submitor; 
     let receiver = this.state.receiver; 
     if(this.state.taskInfo == ""){
      Toast.fail("请输入任务情况！");
      return;
     }
     if(this.state.devInfo == ""){
      Toast.fail("请输入机械情况！");
      return;
     }
     if(this.state.driveTestInfo == ""){
      Toast.fail("请输入试车情况！");
      return;
     }
     if(this.state.attentions == ""){
      Toast.fail("请输入注意事项！");
      return;
     }
     if(this.state.memo == ""){
      Toast.fail("请输入备注！");
      return;
     }
     if(submitor.correctOrg && submitor.correctOrg.name !== ''){
        data.shiftSubmitor = submitor.correctOrg.name
     } else {
        data.shiftSubmitor = data.shiftSubmitor
     }
     if(receiver.correctOrg && receiver.correctOrg.name !== ''){
        data.shifReceiver = receiver.correctOrg.name
     } else {
        data.shifReceiver = data.shifReceiver
     } 
     data.date = new Date(datatime.datetime).getTime();  
     data.shiftDate = new Date(datatime.time).getTime(); 
     data.matInfo = this.state.matInfo.value;
     data.taskInfo = this.state.taskInfo;
     data.devInfo = this.state.devInfo;
     data.driveTestInfo = this.state.driveTestInfo;
     data.attentions = this.state.attentions;
     data.memo = this.state.memo; 
     ajax.postJSON(
      saveUrl, 
      JSON.stringify(data),
      data => {
        if(data.success) {
          console.log(data);
          this.context.router.goBack('/deviceProvider/deviceRunList');
        } else {
          Toast.fail(data.backMsg)
        }
      } 
    );  
  } 
 // 返回
  callback=()=> {
    this.context.router.goBack();
  } 
  render() {
    const {isShowDeviceRef,data,datatime,submitor,receiver,isShowSpecialPsnRef,supId,matInfo,taskInfo,devInfo,driveTestInfo,attentions,memo} = this.state                                                 
    const matInfoList = [
      {
        value: 1,
        label: '良好'
      }, {
        value: 2,
        label: '一般'
      }, {
        value: 3,
        label: '差'
    }];
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
                data.aduitor ? '':<div onClick = {this.runCharge}>确认</div>
              }
          >设备交接班记录</NavBar>
        <div>
          <div className='zui-content'>
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <Item extra={data.projectName}>项目名称</Item>
                  <Item extra={data.code?data.code:data.mgNo} arrow="horizontal" onClick={this.openDeviceRef}>设备管理编号</Item>
                  <Item extra={data.contractName}>合同名称</Item>
                  <Item extra={data.devName}>设备名称</Item>
                  <Item extra={data.devModel}>设备型号</Item> 
                </List>
              </Accordion.Panel>
            </Accordion>
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="交接班记录">
                <List className="my-list"> 
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择"
                    value={datatime.datetime}
                    onChange={
                      (date) => {
                        datatime.datetime = date;
                        this.setState({datatime,});
                      }
                    }
                  >
                    <List.Item arrow="horizontal">日期</List.Item>
                  </DatePicker>

                  <List.Item  
                    extra={ (submitor.correctOrg && submitor.correctOrg.name !== '') ? submitor.correctOrg.name : data.shiftSubmitor } 
                    onClick={this.chooseReformPersonWindow} 
                    arrow="horizontal"    
                  >交班人</List.Item>

                  <List.Item  
                    extra={ (receiver.correctOrg && receiver.correctOrg.name !== '') ? receiver.correctOrg.name : data.shifReceiver } 
                    onClick={this.chooseReformPersonWindow} 
                    arrow="horizontal"    
                  >接班人</List.Item>

                  <DatePicker
                    mode="datetime"
                    title="选择日期"
                    extra="请选择"
                    value={datatime.time}
                    onChange={
                      (date) => {
                        datatime.time = date;
                        this.setState({datatime,});
                      }
                    }
                  >
                    <List.Item arrow="horizontal">交接时间</List.Item>
                  </DatePicker>

                  <Picker 
                    data={ matInfoList } 
                    cols={1}
                    extra="请选择"
                    value={ [matInfo.value] }
                    onChange={
                      (value) => {
                        console.log('Picker value == ', value[0]);
                        matInfo.value = value[0];
                        matInfoList.map(function(item, index){
                          if(item.value == matInfo.value){
                            matInfo.label = item.label;
                            return;
                          }
                        });
                        console.log('Picker matInfo == ', matInfo);
                        this.setState({matInfo: matInfo,});
                      }
                    }
                  >
                    <List.Item arrow="horizontal">保养情况</List.Item>
                  </Picker>

                  <List.Item >任务情况
                    <TextareaItem  
                      autoHeight
                      labelNumber={5}
                      placeholder='请输入'   
                      onChange={
                        (value) => {  
                          this.setState({ taskInfo:  value});
                        }
                      }
                    />
                  </List.Item>  

                  <List.Item >机械情况
                    <TextareaItem  
                      autoHeight
                      labelNumber={5}
                      placeholder='请输入'  
                      onChange={
                        (value) => {  
                          this.setState({ devInfo:  value});
                        }
                      }
                    />
                  </List.Item>  

                  <List.Item >试车情况
                    <TextareaItem  
                      autoHeight
                      labelNumber={5}
                      placeholder='请输入'  
                      onChange={
                        (value) => {  
                          this.setState({ driveTestInfo:  value});
                        }
                      }
                    />
                  </List.Item>  

                  <List.Item >注意事项
                    <TextareaItem  
                      autoHeight
                      labelNumber={5}
                      placeholder='请输入'  
                      onChange={
                        (value) => {  
                          this.setState({ attentions:  value});
                        }
                      }
                    />
                  </List.Item>  

                  <List.Item >备注
                    <TextareaItem  
                      autoHeight
                      labelNumber={5}
                      placeholder='请输入'  
                      onChange={
                        (value) => {  
                          this.setState({ memo:  value});
                        }
                      }
                    />
                  </List.Item>   

                </List>
              </Accordion.Panel>
            </Accordion>
          </div> 
        </div>
        <DeviceRef submitDeviceRef={ this.submitDeviceRef } isShowDeviceRef={ isShowDeviceRef } />
        <SpecialPsnRef submitSpecialPsnRef={ this.submitSpecialPsnRef } isShowSpecialPsnRef={ isShowSpecialPsnRef } supId={supId}/>
      </div>
    );
  }
};

DeviceProviderHandoverRecord.contextTypes = {  
     router:React.PropTypes.object  
}  

export default DeviceProviderHandoverRecord;
