import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, Picker, Toast, TextareaItem, ImagePicker, Flex, Checkbox } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
import '../deviceCheck.less';
// import '../../../static/css/iconfont.css';
/* 引入参照 */ 
import DeviceRef from '../../../pub/refs/component/deviceRef';
import PsnRef from '../../../pub/refs/component/psnRef';
import SpecialPsnRef from '../../../pub/refs/component/specialPsnRef';

const loginProjectUserUrl = MODULE_URL.DEVCONT_BASEHOST + "/loginContext/getProjectUserInfo";
const saveUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/insert';
const devRefUrl = MODULE_URL.DEVCONT_BASEHOST + '/devmgno/refinfo/reflist';
const contractUrl = MODULE_URL.DEVCONT_BASEHOST + "/deviceleasecontract/findById";
const checkItemUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/checkitems';
const billCodeUrl = MODULE_URL.DEVCONT_BASEHOST + "/getbc/DC01"; //获取单据编码
const checktypeListUrl = MODULE_URL.SHARE_BASEHOST + "/defdoc/manage/getbydefdoclistcode";

const billType = "DC01"; //单据类型
const checkItemBillType = "DCI001";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

//格式化日期
function formatDate(date) {
  /* eslint no-confusing-arrow: 0 */
  const pad = n => n < 10 ? `0${n}` : n;
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${dateStr}`;
}

class DeviceCheckAdd extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectInfo: {},
      data: {
        examId: authToken.getStaff(),
        examTime: now
      },
      checkType: [],
      checkTypeInfo: {
        value: '01',
        label: '定期检查表'
      },
      resultInfo: {
        value: 1,
        label: '合格'
      },
      checkDetails: [],
      correctTable: [],
      correctObj: {},
      deviceInfo: {},
      checkPersonInfo: {},
      showCorWindow: false,
      isShowDeviceRef: false,
      isShowPsnRef: false,
      isShowSpecialPsnRef: false,
      supId:''
    };

    this.submitDeviceRef = this.submitDeviceRef.bind(this);
    this.submitPsnRef = this.submitPsnRef.bind(this);
    this.submitSpecialPsnRef = this.submitSpecialPsnRef.bind(this);
  }

  componentWillMount() {
    
  }

  //完成渲染后(真实DOM)加载
  componentDidMount() {
    this.getProject();
    this.getchecktypeList();

    let checkPersonInfo = {
      id: authToken.getUserId(),
      name: authToken.getUserName()
    }
    this.setState({
      checkPersonInfo: checkPersonInfo
    });
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

  //检查类型
  getchecktypeList = () => {
    let param = {};
    param.defdoclistCode = 'device_check_cat';
    ajax.getJSON(
      checktypeListUrl, 
      param, 
      backData => {
      let data = backData.backData;
      let checkTypeList = [];
      for(let i = 0; i < data.length; i++){
        checkTypeList.push({
          value: data[i].code,
          label: data[i].name
        });
      }
      this.setState({
        checkType: checkTypeList
      }); 
      console.log('checkType == ', this.state.checkType);
    });
  }

  //获取附件列表
  getAttachList = (itemDetails, callback) => {
    itemDetails.forEach(function(items) {
      var subItems = items.children ? items.children : [];
      subItems.forEach(function(sub) {
        sub.attachesList = [];
        var params = {
          id: sub.checkBillId,
          billType: 'DC01',
          type: sub.id + '_attaches'
        };
        // Files.filesDownLoad(sub, params, callback);
      });
    });
  }

  //打开设备参照
  openDeviceRef = () => {
    this.setState({
      isShowDeviceRef: true,
      isShowPsnRef: false,
      isShowSpecialPsnRef: false
    });
  }

  //设备参照回调
  submitDeviceRef = (deviceInfo,type) => {
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
        this.initCheckType(checkTypeInfo.value);
      case 'close':
        this.setState({
          isShowDeviceRef: false
        });
      default:
        ;
    } 
  }

  //打开人员参照
  openPsnRef = () => { 
    this.setState({
      isShowDeviceRef: false,
      isShowPsnRef: true,
      isShowSpecialPsnRef: false, 
    });
  }

  //人员参照回调
  submitPsnRef = (psnInfo,type) => {
    switch(type){
      case 'open': 
        console.log('psnInfo == ', psnInfo);
        let { data } = this.state;
        let checkPersonInfo = {
          id: psnInfo.id,
          name: psnInfo.name
        };
        data.examId = {
          code: psnInfo.code,
          id: psnInfo.id,
          name: psnInfo.name
        }
        this.setState({
          data: data,
          checkPersonInfo: psnInfo,
          isShowPsnRef: false
        });
      case 'close':
        this.setState({
          isShowPsnRef: false
        });
      default: ;
    }
  }

  //特种作业人员参照回调
  submitSpecialPsnRef = (specialPsnInfo,type) => {
    switch(type){
      case 'open':
        console.log('specialPsnInfo ====222=== ', specialPsnInfo);
        let { correctObj, isShowSpecialPsnRef } = this.state;
        correctObj.correctOrg = {
          id: specialPsnInfo.id,
          name: specialPsnInfo.name
        };
        this.setState({
          correctObj,
          isShowSpecialPsnRef: false
        });
      case 'close':
        this.setState({
          isShowSpecialPsnRef: false
        });
      default: ;
    }
  }

  //初始化 检查类别
  initCheckType = (checkType) => {
    let { data } = this.state; 
    const params = {
      billType : billType,
      checkType: checkType,
      devId: data.devId,
      contId: data.contractId
    }; 
    Toast.loading('正在加载检查内容...', 0);
    ajax.getJSON(
      checkItemUrl, 
      params, 
      data => {
      var backData = data.backData;
      if(backData && backData.length > 0) {
        var items = [];
        var checkDetails = [];
        for(var i = 0; i < backData.length; i++) {
          var o = {
            pid: backData[i].pid,
            id: backData[i].id,
            dictCkId: backData[i].id,
            checkContent: backData[i].checkContent,
            checkSeril: backData[i].checkSeril,
            attaches: '',
            attachesList: [],
            result: null,
            isCorrect: null,
            comment: '合格'
          };
          items.push(o);
        }
        items.forEach(function(item) {
          if(!item.pid)
            checkDetails.push(item);
        });
        items.forEach(function(sub) {
          checkDetails.forEach(function(par) {
            if(sub.pid === par.id) {
              if(!par.children)
                par.children = [];
              sub.isCorrect = 0;
              sub.result = 1;
              sub.isShowCorrectBtn = 0;
              par.children.push(sub);
            }
          });
        });
        console.log('checkDetails === ', checkDetails);
        this.setState({
          checkDetails: checkDetails
        });
      } else {
        this.setState({
          checkDetails: []
        });
      } 
      Toast.hide();
    });
  }

  //附件上传和删除
  onFilesChange = (pIndex, subIndex, subItem, fileList, type, index) => {
    console.log('this.state.checkDetails === ', this.state.checkDetails);
    console.log('pIndex === ', pIndex);
    console.log('subIndex === ', subIndex);
    console.log('subItem === ', subItem);
    console.log('files === ', files);
    console.log('type === ', type);
    console.log('index === ', index);
    let { checkDetails } = this.state;
    // checkDetails[pIndex].children[subIndex].attaches = files;
    if(type === 'add'){
      let source = {};
      source.sourceId = null;
      source.sourceType = '102345678';
      Toast.loading('正在上传...', 0);
      files.multiFilesUpLoad(
        checkDetails[pIndex].children[subIndex], 
        fileList, 
        "DC01", 
        authToken, 
        source,
        (data) => {
          console.log('callback data === ', data);
          checkDetails[pIndex].children[subIndex].attachesList = data.attachesList;
          this.setState({
            checkDetails,
          });
          Toast.hide();
        }
      );
    }else {
      let attachesList = checkDetails[pIndex].children[subIndex].attachesList;
      attachesList.splice(index, 1);
      checkDetails[pIndex].children[subIndex].attachesList = attachesList;
      this.setState({
        checkDetails,
      });
    }
  }

  //保存检查内容
  saveComment = (pIndex, subIndex, subItem, val) => {
    let { checkDetails } = this.state;
    checkDetails[pIndex].children[subIndex].comment = val;
    this.setState({
      checkDetails,
    });
  }

  //是否合格点击事件
  onQualifiedChange = (pIndex, subIndex, obj) => {
    let { checkDetails } = this.state;
    checkDetails[pIndex].children[subIndex].result = obj.result === 1 ? 0 : 1;
    this.setState({
      checkDetails,
      isShowSpecialPsnRef:false,
      isShowDeviceRef: false,
      isShowPsnRef: false,
    });
  }

  //是否整改点击事件
  onReformChange = (pIndex, subIndex, obj) => {
    let { checkDetails } = this.state;
    checkDetails[pIndex].children[subIndex].isCorrect = obj.isCorrect === 1 ? 0 : 1;
    this.setState({
      checkDetails,
      isShowSpecialPsnRef:false,
      isShowDeviceRef: false,
      isShowPsnRef: false,
    });
  }

  //打开整改页面
  showCorWindow = (pIndex, subIndex, obj) => {
    let { correctTable, correctObj } = this.state;
    correctObj = {
      rowState: 'add',
      isEdit: false,
      correctState: '待整改',
      openType: 'check',
      correctId: obj.id,
      itemId: obj.id,
      sevrtLevel: 0,
      requirement: '',
      endDate: '',
      endDateObj: new Date(),  
      correctOrg: {
        id: '',
        name: ''
      },
      correctRecordId: null,
      reviewRecordId: null,
      state: 0
    }; 
    correctTable.forEach(function(item, index){
      if(item.correctId === obj.id)
        correctObj = item;
    });
    if(correctObj.id !== obj.id){
      
    }
    this.setState({
      showCorWindow: true,
      isShowDeviceRef: false,
      isShowPsnRef: false,
      isShowSpecialPsnRef:false, 
      correctObj,
    });
  }

  //关闭整改页面
  closeReformWindow = () => {
    this.setState({
      showCorWindow: false,
      isShowSpecialPsnRef:false
    });
  }

  //整改信息确定
  submitReformWindow = () => {
    let { correctTable, correctObj } = this.state;
    let isExist = false;
    console.log('submitReformWindow  correctObj  222333==== ', correctObj);
    if(correctObj.requirement === ''){
      Toast.info('请输入整改要求！', 1);
      return;
    }
    if(correctObj.correctOrg.id === ''){
      Toast.info('请输入整改人！', 1);
      return;
    }
    correctTable.forEach(function(item, index){
      if(item.correctId === correctObj.correctId){
        correctTable[index] = correctObj;
        isExist = true;
      }
    });
    if(!isExist) correctTable.push(correctObj);
    this.setState({
      correctTable,
    }, () => {
      this.closeReformWindow();
    });
  }

  //整改人选择（打开特种人员参照）
  chooseReformPersonWindow = () => {

    this.setState({
      supId:this.state.data.supplierId,
      isShowDeviceRef: false,
      isShowPsnRef: false,
      isShowSpecialPsnRef: true
    });
  }

  //保存整改要求
  saveRequirement = (value) => {
    let { correctObj } = this.state;
    correctObj.requirement = value;
    this.setState({
      correctObj,
    });
  }

  //统一提交单据
  handleSubmit = () => {
    let { data, projectInfo, resultInfo, checkTypeInfo, checkDetails, correctTable } = this.state;

    if(checkDetails) {
      for(var i = 0; i < checkDetails.length; i++) {
        checkDetails[i].attaches = '';
        for(var j = 0; j < checkDetails[i].children.length; j++) {
          var attaches = checkDetails[i].children[j].attachesList.map(function(item, index) {
            return item.gid;
          }).join(',');
          checkDetails[i].children[j].attaches = attaches;
        }
      } 
    }

    let postData = {};
    postData.billState = 1;
    postData.examState = 1;
    postData.billType = billType;
    postData.projectId = projectInfo.id;
    postData.mgNo = data.mgNo;
    postData.contractName = data.contractName;
    postData.devName = data.devName;
    postData.devModel = data.devModel;
    postData.checkType = checkTypeInfo.value;
    postData.examTime = new Date(data.examTime).getTime();
    postData.examId = data.examId;
    postData.spotId = data.spotId;
    postData.result = resultInfo.value;
    postData.editTable = checkDetails; 
    postData.correctTable = correctTable; 

    console.log('postData === ', postData);
    Toast.loading('正在提交...', 0);
    ajax.postJSON(
      saveUrl,
      JSON.stringify(postData),
      (data) => {
        console.log('callback data === ', data);
        if(data.success){
          Toast.hide();
          this.context.router.goBack('device/deviceCheckList');
        }
      });
  }

  //返回
  callback = () => {
    this.context.router.goBack();
  }

  render() {
    const { 
      supId,
      projectInfo, 
      checkType, 
      checkTypeInfo, 
      resultInfo, 
      data, 
      checkDetails, 
      deviceInfo, 
      correctObj, 
      showCorWindow, 
      isShowDeviceRef, 
      isShowPsnRef, 
      isShowSpecialPsnRef 
    } = this.state;
    const resultList = [
      {
        value: 1,
        label: '合格'
      }, {
        value: 2,
        label: '不合格'
      }];
    const hardList = [
      {
        value: 0,
        label: '轻微'
      }, {
        value: 1,
        label: '一般'
      }, {
        value: 2,
        label: '严重'
      }];
    let that = this;
    let headerClass = `sub-window ${ showCorWindow ? 'active' : '' }`;
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
            <div onClick={this.handleSubmit}>提交</div>
          }
          >新增设备检查</NavBar>
        <div className='zui-content zui-scroll-wrapper'>
          <div className="zui-scroll-wrapper">
            <Accordion defaultActiveKey="0" className="my-accordion">
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <List.Item thumb={<span className="icon-device icon-device-project"></span>} extra={projectInfo.name}>项目名称</List.Item>
                  <List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} extra={deviceInfo.devNo ? deviceInfo.devNo : '请选择'} arrow="horizontal" onClick={this.openDeviceRef}>设备管理编号</List.Item>
                  <List.Item thumb={<span className="icon-device icon-device-equipment"></span>} extra={deviceInfo.name}>设备名称</List.Item>
                  <List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} extra={deviceInfo.devModel}>设备型号</List.Item>
                  <List.Item thumb={<span className="icon-device icon-device-contract"></span>} extra={deviceInfo.contractName}>合同名称</List.Item>
                  <Picker 
                    data={ checkType } 
                    cols={1}
                    extra="请选择"
                    value={ [checkTypeInfo.value] }
                    onChange={
                      (value) => {                 
                        console.log('Picker value == ', value[0]);
                        checkTypeInfo.value = value[0];
                        checkType.map(function(item, index){
                          if(item.value == checkTypeInfo.value){
                            checkTypeInfo.label = item.label;
                            return;
                          }
                        });
                        console.log('Picker checkTypeInfo == ', checkTypeInfo);
                        this.setState({ checkTypeInfo: checkTypeInfo }, () => {
                          this.initCheckType(value[0]);
                        });
                      }
                    }
                  >
                    <List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} arrow="horizontal">检查类型</List.Item>
                  </Picker>
                  <List.Item thumb={<span className="icon-device icon-device-checkType"></span>} extra={data.examId.name} arrow="horizontal" onClick={this.openPsnRef}>检查人员</List.Item>
                  <DatePicker
                    mode="date"
                    title="选择日期"
                    extra="请选择"
                    value={data.examTime}
                    onChange={
                      (date) => {
                        data.examTime = date;
                        this.setState({ data:  data});
                      }
                    }
                  >
                    <List.Item thumb={<span className="icon-device icon-device-inDate"></span>} arrow="horizontal">检查时间</List.Item>
                  </DatePicker>
                  <Picker 
                    data={ resultList } 
                    cols={1}
                    extra="请选择"
                    value={ [resultInfo.value] }
                    onChange={
                      (value) => {                 
                        console.log('Picker value == ', value[0]);
                        resultInfo.value = value[0];
                        resultList.map(function(item, index){
                          if(item.value == resultInfo.value){
                            resultInfo.label = item.label;
                            return;
                          }
                        });
                        console.log('Picker resultInfo == ', resultInfo);
                        this.setState({ resultInfo: resultInfo });
                      }
                    }
                  >
                    <List.Item thumb={<span className="icon-device icon-device-checkType"></span>} arrow="horizontal">巡检结果</List.Item>
                  </Picker>
                </List>
              </Accordion.Panel>
            </Accordion>
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>检查内容</h2>
            </div>
            <Accordion defaultActiveKey="0" className="my-accordion">
            {
              checkDetails.map(function(item, pIndex){
                  return  <Accordion.Panel key={pIndex} header={item.checkContent}>
                            {                           
                              (item.children ? item.children : []).map(function(subItem, subIndex){
                                  return  <div key={subIndex} className="content-details index-list">
                                            <div className="wrap-index">
                                              <p className="index-text hair-line-bottom">
                                                <span className="iconfont icon-project text-green"></span>
                                                <span>{subItem.checkContent}</span>
                                              </p>
                                              <div className="hair-line-bottom" style={{marginBottom: '5px', paddingLeft: '15px', paddingRight: '15px'}}>
                                                <p>检查详情</p>
                                                <TextareaItem
                                                  defaultValue={subItem.comment}
                                                  placeholder="请输入检查详情..."
                                                  autoHeight
                                                  onBlur={ (val) => that.saveComment(pIndex, subIndex, subItem, val)}
                                                />                   
                                              </div>
                                              <ImagePicker
                                                files={subItem.attachesList}
                                                onChange={(files, type, index) => {
                                                  that.onFilesChange(pIndex, subIndex, subItem, files, type, index);
                                                }}
                                                onImageClick={(index, fs) => console.log(index, fs)}
                                                selectable={true}
                                                multiple={true}
                                              />
                                              <div className='btn-group hair-line-bottom add'>
                                                <Flex>
                                                  <Flex.Item>
                                                    <Checkbox.CheckboxItem 
                                                      checked={subItem.result} 
                                                      onChange={() => that.onQualifiedChange(pIndex, subIndex, subItem)}>
                                                      是否合格
                                                    </Checkbox.CheckboxItem>
                                                  </Flex.Item>
                                                  <Flex.Item className={subItem.result ? 'zui-hidden' : ''}>
                                                    <Checkbox.CheckboxItem  className="check-correct"
                                                      checked={subItem.isCorrect} 
                                                      onChange={() => that.onReformChange(pIndex, subIndex, subItem)}>
                                                      是否整改
                                                    </Checkbox.CheckboxItem>
                                                  </Flex.Item>
                                                  <Flex.Item className={(subItem.result || !subItem.isCorrect) ? 'zui-hidden' : ''}>
                                                    <div className='btn-border' onClick={() => that.showCorWindow(pIndex, subIndex, subItem)}>添加改/罚单</div>
                                                  </Flex.Item>
                                                </Flex>
                                              </div>
                                            </div>
                                          </div>
                              })
                            }
                          </Accordion.Panel>
              })
            }
            </Accordion>
          </div>
        </div>
        <div className={headerClass}>
          <NavBar
            icon={<Icon type="cross" />}
            leftContent="关闭" 
            mode="light" 
            onLeftClick={this.closeReformWindow}
            rightContent={
            <div onClick={this.submitReformWindow}>确定</div>
          }
          >整改信息</NavBar>
          <div className='zui-content'>
            <List>
                <Picker 
                  data={ hardList } 
                  cols={1}
                  extra="请选择"
                  value={ [correctObj.sevrtLevel] }
                  onChange={
                    (value) => {                 
                      console.log('Picker value == ', value[0]);
                      correctObj.sevrtLevel = value[0];
                      hardList.map(function(item, index){
                        if(item.value == correctObj.sevrtLevel){
                          checkTypeInfo.label = item.label;
                          return;
                        }
                      });
                      this.setState({ correctObj, });
                    }
                  }
                >
                  <List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} arrow="horizontal">问题严重分类</List.Item>
                </Picker>
                <List.Item 
                  thumb={<span className="icon-device icon-device-contract"></span>}
                  extra={
                    <TextareaItem
                      defaultValue={correctObj.requirement}
                      placeholder="请输入整改要求..."
                      autoHeight
                      onBlur={ (val) => this.saveRequirement(val)}
                    />
                  }
                >整改要求</List.Item>
                <List.Item 
                  thumb={<span className="icon-device icon-device-checkType"></span>}
                  extra={ (correctObj.correctOrg && correctObj.correctOrg.name !== '') ? correctObj.correctOrg.name : '请选择'} 
                  onClick={this.chooseReformPersonWindow} 
                  arrow="horizontal"
                >整改人</List.Item>
                <DatePicker
                  mode="date"
                  title="选择日期"
                  extra="请选择"
                  value={correctObj.endDateObj}
                  onChange={
                    (date) => {
                      console.log('date === ', date);
                      correctObj.endDateObj = date;
                      correctObj.endDate = formatDate(date);
                      this.setState({ correctObj, });
                    }
                  }
                >
                  <List.Item thumb={<span className="icon-device icon-device-inDate"></span>} arrow="horizontal">检查时间</List.Item>
                </DatePicker>
              </List>
          </div>
        </div>
        <DeviceRef submitDeviceRef={ this.submitDeviceRef } isShowDeviceRef={ isShowDeviceRef } />
        <PsnRef submitPsnRef={ this.submitPsnRef } isShowPsnRef={ isShowPsnRef } />
        <SpecialPsnRef submitSpecialPsnRef={ this.submitSpecialPsnRef } isShowSpecialPsnRef={ isShowSpecialPsnRef } supId={supId}/>
      </div>
    );
  }
}

DeviceCheckAdd.contextTypes = {  
     router:React.PropTypes.object  
}  

export default DeviceCheckAdd;
