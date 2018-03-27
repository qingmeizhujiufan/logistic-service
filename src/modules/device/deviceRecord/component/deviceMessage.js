import React from 'react';
import { NavBar, Icon, Accordion, List, Tabs } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/devRecord/item/";

const Item = List.Item;

class DeviceMessage extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      infoData: {},
      makeFile: {
        attachesList: []
      },
      productFile: {
        attachesList: []
      },
      checkFile: {
        attachesList: []
      },
      recordFile: {
        attachesList: [],
        attachesList: []
      },
      instructionFile: {
        attachesList: []
      }
    };
  } 
 
  componentWillMount = () => {
    let pageUrl = findByIdUrl + this.props.params.id+'/1';
    ajax.getJSON(
      pageUrl,
      null,
      data => {
        var backData = data.backData;
        this.setState({
          infoData: backData
        });
        let makeFile = {
          attachesList: []
        },
        productFile = {
          attachesList: []
        },
        checkFile = {
          attachesList: []
        },
        recordFile = {
          attachesList : []
        },
        instructionFile = {
          attachesList : []
        };
        let id = backData.ntfId;
        this.getAttachList(id, 
          [makeFile, productFile, checkFile, recordFile, instructionFile], 
          ()=>{
            this.setState({
            makeFile:makeFile,
            productFile:productFile,
            checkFile:checkFile,
            recordFile:recordFile,
            instructionFile:instructionFile
          });
        });
      });

    
  } 
  //获取附件列表
  getAttachList = (id, fileArray, callback) => {
    console.log("id==",id);
    for (let i = 11; i <= 15; i++) {
        let param = {
          id: id,
          billType: 'DEN01',
          type: i,
        };
        if(i === 11){
          files.filesDownLoad(fileArray[0], param, callback); 
        }else if(i === 12){
          files.filesDownLoad(fileArray[1], param, callback);
        }else if(i === 13){
          files.filesDownLoad(fileArray[2], param, callback);
        }else if(i === 14){
          files.filesDownLoad(fileArray[3], param, callback);
        }else if(i === 15){
          files.filesDownLoad(fileArray[4], param, callback);
        }
    };
    
  } 
// 返回
  callback = () => {
    this.context.router.goBack();
  } 
 
  render() {
    let infoData = this.state.infoData;
    let makeFile = this.state.makeFile || {};
    let productFile = this.state.productFile || {};
    let checkFile = this.state.checkFile || {};
    let recordFile = this.state.recordFile || {};
    let instructionFile = this.state.instructionFile || {};
    const AttachList1 = <YYShowAttachesList attachesList = {makeFile.attachesList} />;
    const AttachList2 = <YYShowAttachesList attachesList = {productFile.attachesList} />;
    const AttachList3 = <YYShowAttachesList attachesList = {checkFile.attachesList} />;
    const AttachList4 = <YYShowAttachesList attachesList = {recordFile.attachesList} />;
    const AttachList5 = <YYShowAttachesList attachesList = {instructionFile.attachesList} />;
                                                                 
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >单机档案</NavBar>
        <div> 
          <div className='zui-content zui-scroll-wrapper'>
            <div className = 'zui-scroll'>
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="基本信息">
                  <List className="my-list">
                    <Item extra={infoData.devName}>设备名称</Item>
                    <Item extra={infoData.devModel}>设备型号</Item>
                    <Item extra={infoData.mainParam}>主要参数</Item>
                    <Item extra={infoData.power}>功率</Item>
                    <Item extra={infoData.maker}>品牌</Item>
                    <Item extra={infoData.filNo}>备案编号</Item>
                    <Item extra={infoData.prodTime ? infoData.prodTime : ''}>出场时间</Item>
                    <Item extra={infoData.factoryNo}>出厂编号</Item>
                    <Item extra={infoData.equityComp}>产权单位</Item>
                    <Item extra={infoData.equityType == '001' ? '供方自有':'供方外租'}>产权性质</Item>
                    <Item extra={AttachList1}>制造许可证</Item>
                    <Item extra={AttachList2}>产品合格证</Item>
                    <Item extra={AttachList3}>制造监督检验证明</Item>
                    <Item extra={AttachList4}>备案证明</Item>
                    <Item extra={AttachList5}>使用说明书</Item>
                  </List>
                </Accordion.Panel>
              </Accordion>

              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="保养预警信息">
                  <List className="my-list">
                    <Item extra={infoData.matCircle}>保养周期（天）</Item>
                    <Item extra={infoData.matTime}>保养台时（小时）</Item>
                    <Item extra={infoData.matAlmCircle}>保养预警周期（天）</Item>
                    <Item extra={infoData.matAlmTime}>保养预警台时（小时）</Item>
                        </List>
                </Accordion.Panel>
              </Accordion> 
             
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="进场通知信息">
                  <List className="my-list">
                    <Item extra={infoData.enterDate}>进场时间</Item>
                    <Item extra={infoData.memo}>进场备注</Item>
                        </List>
                </Accordion.Panel>
              </Accordion>

              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="进场验收信息">
                  <List className="my-list">
                   <Item extra={infoData.mgNo}>设备管理编号</Item>
                   <Item extra={infoData.examTime ? infoData.examTime : ''}>验收时间</Item>
                   <Item extra={infoData.examUserName}>验收人</Item>
                   <Item extra={infoData.respUserName}>负责人</Item>
                  </List>
                </Accordion.Panel>
              </Accordion>
     
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="使用登记信息">
                  <List className="my-list">
                   <Item extra={infoData.registerNo}>登记牌号</Item>
                   <Item extra={infoData.rstartTime ? infoData.rstartTime : ''}>登记牌开始日期</Item>
                   <Item extra={infoData.rendTime ? infoData.rendTime : ''}>登记牌截止日期</Item>
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

DeviceMessage.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceMessage;
