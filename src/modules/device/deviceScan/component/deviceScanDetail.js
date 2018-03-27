import React from 'react';
import { NavBar, Icon, Accordion, List, Button, Modal, WhiteSpace, WingBlank, Tabs, Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
import '../deviceScan.less';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devrent/rent/findById';  
const loginProjectUserUrl = MODULE_URL.DEVCONT_BASEHOST + "/loginContext/getProjectUserInfo";
const handByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/devRecord/detail";
const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/devRecord/item";
const prompt = Modal.prompt;
const Item = List.Item;

class DeviceScanDetail extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      data: {},  
      devicelist: [],
      isShowDeviceRef:false,
      projectInfo: {},
      infoData:{},
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
  componentWillMount() {
    
  }
  
  componentDidMount() {
    this.getProject(); 
  }

  //获取项目信息
  getProject = () => {
    const param = {
      companyId: authToken.getOrgaId(),
      userId: authToken.getUserId()
    };
    ajax.getJSON(
      loginProjectUserUrl,
      param,
      (data) => {
        let projectInfo = {
          id: data.backData.project.projectId,
          name: data.backData.project.projectName
        };
        this.setState({
          projectInfo,
        });
      }
    );
  }

  //输入确认
  confirm = () => {   
    prompt('提示', '请输入二维码编号', [
        { text: '取消' },
        { text: '确认', onPress: value => {  
            if(value == ''){
              Toast.info('管理编号不能为空'); 
              return;
            } 
            if(!this.state.projectInfo.id) {
              Toast.info('当前项目为空'); 
              return;
            } 
           Toast.loading('正在加载...', 0);
           ajax.getJSON(
            handByIdUrl+'/'+this.state.projectInfo.id+'/'+encodeURIComponent(value),
            null, 
             (data) => {
              this.backDataResult(data) 
             } 
          );
           Toast.hide();
          }
        },
        ], 'plain-text')
  }

  //扫码
  scanrcode = () => {  
    if(typeof YYPlugin === 'undefined') return;
      YYPlugin.call(
        "CommonPlugin", 
        "scan",  
        {command: "noDail"},
        info => {
          //info.result为扫描后返回的结果 
          Toast.loading('正在加载...', 0);
          ajax.getJSON(
            findByIdUrl + '/' + info.result + '/1',
            null, 
            (data) => { 
              this.backDataResult(data);
              Toast.hide();
            }  
          )
        } 
      );
  } 
// 处理扫码返回的结果
  backDataResult = (data) => {
     if(data.success == false){
        Toast.info(data.backMsg)
     }
     this.setState({
        infoData: data.backData
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
      let id = data.backData.ntfId;
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
      this.setState({isShowDeviceRef: true}); 
  }

    //获取附件列表
  getAttachList = (id, fileArray, callback) =>{
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


   //关闭单机页面
  closeRefWindow = () => {
    this.setState({isShowDeviceRef: false}); 
  }

  render() {
    let infoData = this.state.infoData;    
    let isShowDeviceRef = this.state.isShowDeviceRef;
    let headerClass = `ref-window ${ isShowDeviceRef ? 'active' : '' }`;
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
          >二维码扫描</NavBar>
        <div className='zui-content'>
           <div className="footer-btn-group" > 
              <div className="left-btn" onClick={this.confirm}>手动输入编号</div>
              <div className="right-btn" onClick={this.scanrcode}>扫描二维码</div> 
           </div>
        </div>

        <div className={headerClass}>
          <NavBar
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              mode="light" 
              onLeftClick={this.closeRefWindow  }
            >单机档案</NavBar>
          <div className='zui-content sys-scroll zui-scroll-wrapper'>
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

DeviceScanDetail.contextTypes = {  
     router:React.PropTypes.object  
}  
export default DeviceScanDetail;
