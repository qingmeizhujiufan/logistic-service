import React from 'react';
import { NavBar, Icon, Button , Accordion, List } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/findById";
const Item = List.Item;
class DeviceHandoverRecord extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      detailRun: {},
    };
  } 
 
  componentWillMount = () => {
    const param = {
      id: this.props.params.id
    }
    const runDay = this.props.params.day;
    ajax.getJSON(
      findByIdUrl,
      param,
      data => {
        if(data.success) { 
            var backData = data.backData; 
            var runDetail = {};
            var detailRun = {};
            var content = backData.content;
            if(content) {
              for(var i = 0; i < content.length; i ++) {
                if(content[i].day == runDay) {
                  runDetail = content[i];  
                }
              }  
            } 
            var infodata = runDetail.shiftArr;  
            for(var j = 0; j<infodata.length; j++){
              if(infodata[j].id != null){
                detailRun = infodata[j]
              }
            } 
            this.setState({
              detailRun: detailRun
            });
          }
      }
    );
  } 

  //点击确认事件
  runCharge = () => {

    var Id = this.state.detailRun.shiftId;
    var user = authToken.getUserName();
    var userID = authToken.getUserId(); 
    var runCharge = MODULE_URL.DEVCONT_BASEHOST + "/dev/pjtrun/setAduitor" + '/' + Id + '/' + user + '/' + userID + '/shift';
    console.log(runCharge);
    ajax.getJSON(runCharge, null, function(data) {
      if(data.success) {
        console.log(data);
        this.context.router.goBack();
      }
    })
  } 
 // 返回
  callback = () => {
    this.context.router.goBack();
  } 
  
  render() {
    const detailRun = this.state.detailRun;  
    console.log(detailRun)                                                 
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
                detailRun.aduitor ==null? <div onClick={this.runCharge}>提交</div>:''
              }
          >设备交接班记录</NavBar>
        <div>
          <div className='zui-content zui-scroll-wrapper'>
            <div className = 'zui-scroll'>
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="基本信息">
                  <List className="my-list">
                    <Item extra={detailRun.projectName}>项目名称</Item>
                    <Item extra={detailRun.contractName}>合同名称</Item>
                    <Item extra={detailRun.devName}>设备名称</Item>
                    <Item extra={detailRun.devModel}>设备型号</Item>
                    <Item extra={detailRun.mgNo}>设备管理编号</Item>
                  </List>
                </Accordion.Panel>
              </Accordion>
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="交接班记录">
                  <List className="my-list">
                    <Item extra={detailRun.date}>日期</Item>
                    <Item extra={(detailRun.shift===1) ? 'Ⅰ班' : ((detailRun.shift===2) ? 'Ⅱ班' : 'Ⅲ班')}>台班</Item>
                    <Item extra={detailRun.shiftSubmitor}>交班人</Item>
                    <Item extra={detailRun.shifReceiver}>接班人</Item>
                    <Item extra={detailRun.shiftDate}>交接时间</Item>
                    <Item extra={(detailRun.matInfo===1) ? '良好' : ((detailRun.matInfo===2) ? '一般' : '差')}>保养情况</Item>
                    <Item extra={detailRun.taskInfo}>任务情况</Item>
                    <Item extra={detailRun.devInfo}>机械情况</Item>
                    <Item extra={detailRun.driveTestInfo}>试车情况</Item>
                    <Item extra={detailRun.attentions}>注意情况</Item>
                    <Item extra={detailRun.aduitor? detailRun.aduitor : '还未确认'}>审批人</Item>
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

DeviceHandoverRecord.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceHandoverRecord;
