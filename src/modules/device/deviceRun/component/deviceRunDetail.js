import React from 'react';
import { NavBar, Icon, Button , Accordion, List } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/findById";

class DeviceRunDetail extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      runDetail: {},
      totalStopHours: 0,
      time: null,
      stopType: [{
        value: 0,
        type: '待工'
      }, {
        value: 1,
        type: '故障'
      }, {
        value: 2,
        type: '气候'
      }, {
        value: 3,
        type: '保养'
      }, {
        value: 4,
        type: '停修'
      }, {
        value: 5,
        type: '安装'
      }],
    };
  }
 
  componentWillMount = () => {
    const param = {
      id: this.props.params.id
    }
    const runDay = this.props.params.date;
    ajax.getJSON(
      findByIdUrl,
      param,
      data => {
        var backData = data.backData;
        this.setState({
          data: backData.common,
          stopArray: []
        });
        var runDetail = {};
        var content = backData.content;
        if(content) {
          for(let i = 0; i < content.length; i++) {
            if(content[i].day == runDay) {
              runDetail = content[i];
              var totalHours = 0
              var stopHours = content[i].stopHours;
              for(let j = 0; j < stopHours.length; j++) {
                if(stopHours[j] > 0) {
                  var item = {
                    type: this.state.stopType[j].type,
                    hour: stopHours[j]
                  }
                  this.state.stopArray.push(item);
                  totalHours += stopHours[j];
                }
              }
            }
          }
          this.setState({
            totalStopHours: totalHours,
            runDetail: runDetail
          });        
        }
        console.log(this.state.data)
        if(this.state.runDetail.day < 10) { 
            var time = (backData.common.date).substring(0, 8) + "0" + this.state.runDetail.day
            this.setState({
              time: time
            });
          } else {
            var time = (backData.common.date).substring(0, 8) + this.state.runDetail.day
            this.setState({
              time: time
            });
          }
      }
    );
  } 
  
  //点击确认事件
  runCharge = () => {
    var _this = this;
    console.log(_this.props.params.id);
    var Id = this.state.runDetail.runId;
    var user = authToken.getUserName();
    var userID = authToken.getUserId(); 
    var runCharge = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/setAduitor" + '/' + Id + '/' + user + '/' + userID + '/run';
    console.log(runCharge);
    ajax.getJSON(runCharge, null, function(data) {
      if(data.success) {
        console.log(data);
        _this.context.router.goBack();
      }
    })
  } 
 // 返回
  callback = () => {
    this.context.router.goBack();
  } 
  
  render() {
    const {data,time,runDetail,stopArray,totalStopHours} = this.state;           
    console.log(this.state.runDetail)                                        
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={ 
                runDetail.aduitor ==''? <div onClick={this.runCharge}>提交</div>:''
              }
          >设备运转记录</NavBar>
        <div>
          <div className='zui-content zui-scroll-wrapper'>
            <div className = 'zui-scroll'>
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="基本信息">
                  <List className="my-list">
                    <List.Item extra={data.projectName}>项目名称</List.Item>
                    <List.Item extra={data.contractName}>合同名称</List.Item>
                    <List.Item extra={data.devName}>设备名称</List.Item>
                    <List.Item extra={data.devModel}>设备型号</List.Item>
                    <List.Item extra={data.mgNo}>设备管理编号</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion>
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="运行记录">
                  <List className="my-list">
                    <List.Item extra={time}>日期</List.Item>
                    <List.Item extra={runDetail.task}>任务情况</List.Item>
                    <List.Item extra={runDetail.realMachineHour + '小时'}>实作台时</List.Item>
                    <List.Item extra={stopArray&&stopArray.length > 0 ? stopArray.map(function(arr,index){
                        return <List.Item style={{position:'relative',left:'18px'}} key = {index} extra={arr.type+'('+ arr.hour + '小时)'}><span>{''}</span></List.Item>
                      }) : '无停工台时'}>停工台时分类</List.Item>
                    <List.Item extra={totalStopHours + '小时'}>停工台时合计</List.Item>
                    <List.Item extra={runDetail.respUsername}>使用单位负责人</List.Item>
                    <List.Item extra={data.operator}>操作人</List.Item>
                    <List.Item extra={runDetail.aduitor? runDetail.aduitor : '还未确认'}>审批人</List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

DeviceRunDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceRunDetail;
