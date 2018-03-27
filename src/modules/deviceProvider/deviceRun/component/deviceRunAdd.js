import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, TextareaItem, Picker, ImagePicker, Toast, Switch} from 'antd-mobile';
//import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import DeviceRef from '../../../pub/refs/component/deviceRef';
import SpecialPsnRef from '../../../pub/refs/component/specialPsnRef';
 
const saveUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/run/saveBill";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);


class DeviceRunDetail extends React.Component {
	constructor(props) {
    super(props); 
    this.state = { 
      data: {}, 
      runtime:{
      	rundate:now
      },
      datatime:{
        datetime:now,
        time:now
      },
      isShowDeviceRef: false, 
      isShowSpecialPsnRef: false,
      submitor:{},
      receiver:{},
      supId:'',
      correctObj:{},
      machineTeam: {
        value:1,
        label:'一级'
      }, 
      machinehour:'',
      stophour:'',
      stopHourType: {
      	value: 1,
				label: '待工'
      },
      value:'',
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

	componentWillMount() { 
  }

  componentDidMount() {  
  }
//打开设备参照
  openDeviceRef = () => { 
    this.setState({
      isShowDeviceRef: true, 
      isShowSpecialPsnRef: false
    }
    ); 
  }
// 打开特种人员参照
  chooseReformPersonWindow = () => { 
    this.setState({ 
    	supId:authToken.getSupId(),
      isShowDeviceRef: false, 
      isShowSpecialPsnRef: true
    });
  }
//回调设备参照返回的值
  submitDeviceRef = (deviceInfo, type) => {
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
        data.pjtName = deviceInfo.pjtName;
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
  submitSpecialPsnRef = (specialPsnInfo, type) => {
    switch(type){
      case 'open':
        console.log('specialPsnInfo ====222=== ', specialPsnInfo);
        let { correctObj, isShowSpecialPsnRef } = this.state;
        correctObj.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        submitor.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        receiver.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        this.setState({
          correctObj,
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
// 保存提交
  saveData = () => {
    if(this.props.params.id ==1){ 
    	let data = this.state.data; 
    	let runtime = this.state.runtime;
    	let correctObj = this.state.correctObj; 
    	if(this.state.machinehour == ""){
  			Toast.fail("请输入台时！");
  			return;
  		}
  		if(this.state.stophour == ""){
  			Toast.fail("请输入停工台时！");
  			return;
  		}
    	if(correctObj.correctOrg && correctObj.correctOrg.name !== ''){
    		data.operator = correctObj.correctOrg.name
    	} else {
    		data.operator = authToken.getUserName();
    	}
    	data.date = new Date(runtime.rundate).getTime(); 
    	data.machineHour = this.state.machinehour;
    	data.stopHourType = this.state.stopHourType.value;
    	data.machineTeam = this.state.machineTeam.value;
    	data.stopHour = this.state.stophour;
    	data.memo = this.state.value; 
    	ajax.postJSON(
        saveUrl, 
        JSON.stringify(data),
        data => {
          if(data.success) {
            console.log(data);
            this.context.router.goBack();
          } else {
          	Toast.fail(data.backMsg)
          }
        } 
      ); 
    }else {
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
          data.shiftSubmitor = authToken.getUserName();
       }
       if(receiver.correctOrg && receiver.correctOrg.name !== ''){
          data.shifReceiver = receiver.correctOrg.name
       } else {
          data.shifReceiver = authToken.getUserName();
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
  }
// 返回
  callback = () =>{
    this.context.router.goBack();
  }

  render() { 
  	const {data, isShowDeviceRef, datatime,submitor,receiver, isShowSpecialPsnRef, runtime, supId, correctObj, machineTeam ,machinehour, stopHourType, stophour, value,matInfo,taskInfo,devInfo,driveTestInfo,attentions,memo} = this.state;
  	const machineTeamList = [
      {
        value: 1,
        label: '一班'
      }, {
        value: 2,
        label: '二班'
      }, {
        value: 3,
        label: '三班'
    }];
    const stopHourTypeList = [
      {
        value: 1,
				label: '待工'
			}, {
				value: 2,
				label: '故障'
			}, {
				value: 3,
				label: '气候'
			}, {
				value: 4,
				label: '保养'
			}, {
				value: 5,
				label: '停修'
			}, {
				value: 6,
				label: '安装'
			}
    ];
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
        {this.props.params.id ==1? 
        (<NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}  
            rightContent={
            <div onClick={ () => {
                this.saveData(); 
            }}>提交</div>
            }  
        >设备运转记录</NavBar>)
          :
        (<NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
            <div onClick={ () => {
                this.saveData(); 
            }}>提交</div>
            }  
        >设备交接记录</NavBar>)
        }
        <div className='zui-content'>
          
          <List className="my-list">
            <List.Item extra={data.code?data.code:data.mgNo} arrow="horizontal" onClick={this.openDeviceRef} thumb={<span className="icon-device icon-device-equipmentNO"></span>}>设备管理编号</List.Item>
            <List.Item extra={data.pjtName} thumb={<span className="icon-device icon-device-equipment"></span>}>项目名称</List.Item> 
            <List.Item extra={data.devModel} thumb={<span className="icon-device icon-device-equipmentType"></span>}>设备型号</List.Item>
            <List.Item extra={data.devName} thumb={<span className="icon-device icon-device-project"></span>}>设备名称</List.Item>
            <List.Item extra={data.contractName} thumb={<span className="icon-device icon-device-contract"></span>}>合同名称</List.Item> 
          </List> 

        {this.props.params.id ==1? 
          (<div>
              <div className='zui-pane'>
                <h2 className='zui-pane-title'>运行记录</h2>
              </div>
              <List className="my-list" style={{marginTop:'10px'}}>
                <DatePicker
                  mode="date"
                  title="选择日期"
                  extra="请选择"
                  value={runtime.rundate}
                  onChange={
                    (date) => {
                      runtime.rundate = date;
                      this.setState({runtime:  runtime,});
                    }
                  }
                 >
                   <List.Item arrow="horizontal">报修时间</List.Item>
                 </DatePicker>
                 <List.Item  
                    extra={ (correctObj.correctOrg && correctObj.correctOrg.name !== '') ? correctObj.correctOrg.name : authToken.getUserName()} 
                    onClick={this.chooseReformPersonWindow} 
                    arrow="horizontal"
                >操作人</List.Item>
  
                <Picker 
                  data={ machineTeamList } 
                  cols={1}
                  extra="请选择"
                  value={ [machineTeam.value] }
                  onChange={
                    (value) => {
                      console.log('Picker value == ', value[0]);
                      machineTeam.value = value[0];
                      machineTeamList.map(function(item, index){
                        if(item.value == machineTeam.value){
                          machineTeam.label = item.label;
                          return;
                        }
                      });
                      console.log('Picker machineTeam == ', machineTeam);
                      this.setState({machineTeam: machineTeam,});
                    }
                  }
                >
                  <List.Item arrow="horizontal">台班</List.Item>
                </Picker>
  
                <List.Item extra={
                  <TextareaItem  
                    rows = {1}
                    labelNumber={5}
                    defaultValue={data.machineHour}  
                    onChange={
                      (value) => {  
                        this.setState({ machinehour:  value});
                      }
                    }
                  />
                }>
                台时</List.Item>
  
                <Picker 
                  data={ stopHourTypeList } 
                  cols={1}
                  extra="请选择"
                  value={ [stopHourType.value] }
                  onChange={
                    (value) => {
                      console.log('Picker value == ', value[0]);
                      stopHourType.value = value[0];
                      stopHourTypeList.map(function(item, index){
                        if(item.value == stopHourType.value){
                          stopHourType.label = item.label;
                          return;
                        }
                      });
                      console.log('Picker stopHourType == ', stopHourType);
                      this.setState({stopHourType: stopHourType,});
                    }
                  }
                >
                  <List.Item arrow="horizontal">停工台时分类</List.Item>
                </Picker>
  
                <List.Item extra={
                  <TextareaItem  
                    rows = {1}
                    labelNumber={5}
                    defaultValue={data.stopHour}  
                    onChange={
                      (value) => {  
                        this.setState({ stophour:  value});
                      }
                    }
                  />
                }>
                停工台时
                </List.Item>
  
                <List.Item extra={data.totalMachineHour?data.totalMachineHour:'0' }>累计运转台时</List.Item>   
  
                <List.Item >备注
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
          </div>)
            :
          (<div >
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>交接记录</h2>
            </div>
            <List className="my-list"> 
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择"
                    value={datatime.datetime}
                    onChange={
                      (date) => {
                        datatime.datetime = date;
                        this.setState({ datatime:  datatime});
                      }
                    }
                  >
                    <List.Item arrow="horizontal">日期</List.Item>
                  </DatePicker>

                  <List.Item  
                    extra={ (submitor.correctOrg && submitor.correctOrg.name !== '') ? submitor.correctOrg.name : authToken.getUserName()} 
                    onClick={this.chooseReformPersonWindow} 
                    arrow="horizontal"    
                  >交班人</List.Item>

                  <List.Item  
                    extra={ (receiver.correctOrg && receiver.correctOrg.name !== '') ? receiver.correctOrg.name : authToken.getUserName()} 
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
                        this.setState({ datatime:  datatime});
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
                        this.setState({ matInfo: matInfo });
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
          </div>)
        }

        </div>
        <DeviceRef submitDeviceRef={ this.submitDeviceRef } isShowDeviceRef={ isShowDeviceRef } />
        <SpecialPsnRef submitSpecialPsnRef={ this.submitSpecialPsnRef } isShowSpecialPsnRef={ isShowSpecialPsnRef } supId={supId}/>
      </div>
    )
  }
}

DeviceRunDetail.contextTypes = {  
     router:React.PropTypes.object  
}  
export default DeviceRunDetail;