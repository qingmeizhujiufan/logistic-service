import React from 'react';
import { NavBar, Icon, Accordion, List, InputItem, DatePicker, Picker, Toast, Flex, Tabs, TextareaItem, ImagePicker, Button} from 'antd-mobile';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceAccept.less'
/* 引入参照 */ 
import DevBrandRef from '../../../pub/refs/component/devBrandRef';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';
 
const loginProjectUserUrl = MODULE_URL.DEVCONT_BASEHOST + "/loginContext/getProjectUserInfo";
const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/sdetail";
const saveUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/save';
const devRefUrl = MODULE_URL.DEVCONT_BASEHOST + '/enexamdev/refinfo/reflist'; //device-enexam-dev-01 设备参照
const contractRefUrl = MODULE_URL.DEVCONT_BASEHOST + "/devicelease/deviceContrefer/contrefer"; //device-cont-refer   设备合同参照
const checkItemUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/ckitem';
const billCodeUrl = MODULE_URL.DEVCONT_BASEHOST + "/getbc/DEE02"; //获取单据编码
const chkMgNoUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/chkMgNo'; //查询设备管理编号是否重复
const doSubmitUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/info/doSubmit";
const featureUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/featureItem';
const featurerangeUrl = MODULE_URL.SHARE_BASEHOST + '/defdoc/manage/getbydefdoclistcode'; 
const billType = "DEE02"; //单据类型
const tabs = [
  { title: '设备信息' },
  { title: '验收内容' },
  { title: '自定义内容' },
  { title: '保养信息' },
];
//获取当前时间
const now = new Date(Date.now());

class DeviceAcceptAdd extends React.Component{ 
  constructor(props) {
    super(props); 
    this.state = {
      projectInfo: {},
      data: { 
        reportTime: now
      }, 
      evlLevel: {
        value:1,
        label:'优秀'
      },
      featurRange:[],
      pickerList:{},
      featureVal:[],
      levelControlList: [],
      levelControl: '',
      featureValue: [],
      //从authToken获取相应数据
      infoData: {
        id: this.props.params.id,
        examId: authToken.getUserId(),
        examPerson: authToken.getUserName(),
        examTime: now,
        examUserId: authToken.getUserId(),
        examUserName: authToken.getUserName(),
        respUserId: authToken.getUserId(),
        respUserName: authToken.getUserName(),
        pjtId: '', //Constants.DEV_LOGIN_CONTEXT.project.projectId,
        pjtName: '',
        billType: billType,
        companyId: authToken.getOrgaId(),
        companyName: authToken.getOrgaName(),
        projectName: '', //Constants.DEV_LOGIN_CONTEXT.project.projectName,
        matCircle: '',
        matTime: '',
        matAlmCircle: '', 
        matAlmTime: ''
      },
      infoData_range: {},
      devItem: {},
      examDetails: [],
      featureItems: [], 
      billCode: null,
      mgNoIsEx: false,
      deviceValue: [],
      contractValue: [],
      makeFile: {
        attaches: []
      },
      productFile: {
        attaches: []
      },
      checkFile: {
        attaches: []
      },
      recordFile: {
        attaches: []
      },
      instructionFile: {
        attaches: []
      },
      btnstate:'1',
      arritem:[],
      selfDefineDetails:[],
      isShowDeviceRef:false,
      isShowBrandRef: false,
      psnName:'' ,
      value:null,
      infoDataSubmit:{},
      pickerValue:[] 
    };
    this.submitBrandRef = this.submitBrandRef.bind(this);
  }

  //首次渲染之前执行
  componentWillMount = () =>{
    this.getProject();
    this.initBillCode();
    this.initRefContract(authToken.getOrgaId());//合同参照数据
    this.getLevelControlList();
  } 

  //完成渲染后（真实dom）调用
  componentDidMount = () =>{
    let id = this.state.infoData.id;
    let makeFile = {attachesList:[]};
    let productFile = {attachesList:[]};
    let checkFile = {attachesList:[]};
    let recordFile = {attachesList:[]};
    let instructionFile = {attachesList:[]};
    this.getAttachList(id,makeFile, 11, ()=>{
      this.setState({
        makeFile: makeFile
      });
    });
    this.getAttachList(id,productFile, 12, () =>{
      this.setState({
        productFile: productFile
      });
    });
    this.getAttachList(id,checkFile, 13, ()=>{
      this.setState({
        checkFile: checkFile
      });
    });
    this.getAttachList(id,recordFile, 14, () =>{
      this.setState({
        recordFile: recordFile
      });
    });
    this.getAttachList(id,instructionFile, 15, () =>{
      this.setState({
        instructionFile: instructionFile
      });
    });

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

  //初始化加载单据编码
  initBillCode = () =>{
    ajax.postJSON(
      billCodeUrl, 
      null, 
      (data) => {
       this.setState({
        billCode: data.backData.code
      }); 
      console.log('billCode == ', this.state.billCode); 
    });
  } 

  //初始化合同参照数据
  initRefContract = (companyId) => {
    let conditionParam = {
      companyId: companyId,
    };
    let params = {
      condition: JSON.stringify(conditionParam)
    };
    ajax.getJSON(
      contractRefUrl, 
      params, 
      (data) =>{ 
      let refdata = data.data.content;
      if(refdata && refdata.length > 0) {
        let tmp = [];
        for(let i = 0; i < refdata.length; i++) {
          let obj = {
            value: refdata[i].contractId,
            text: refdata[i].contractName,
            contractNo: refdata[i].contractCode
          };
          tmp.push(obj);
        }
        this.setState({
          contractValue: tmp
        });
      }
    }); 
      ajax.getJSON(
        findByIdUrl + '/' + this.props.params.id + '/0', 
        null, 
        (data) => {
        this.setState({
          infoData: {
            contractName: data.backData.notice.contractName,
            contractId: data.backData.notice.contractId,
            projectName: data.backData.notice.projectName,
            contractNo: data.backData.notice.contractNo, 
          },
          infoDataSubmit:data.backData
        });
        let devItem = data.backData.devItem;
        let devList = data.backData.notice ? data.backData.notice.devList : [];
        if(devList[0]) {
          let devInfo = this.state.infoData;
          devInfo.devName = devList[0].devName;
          devInfo.devId = devList[0].devId;
          devInfo.devModel = devList[0].devModel;
          devInfo.devNo = devList[0].devNo;
          devInfo.spotId = (devItem && devItem.spotId) ? devItem.spotId : '';
          devInfo.id = (devItem && devItem.spotId) ? devItem.spotId : '';
          devInfo.contractId = this.state.infoData.contractId;
          devInfo.matCircle = this.state.infoData.matCircle;
          devInfo.matTime = this.state.infoData.matTime;
          devInfo.matAlmCircle = this.state.infoData.matTime;
          devInfo.matAlmTime = this.state.infoData.matTime;
          this.setState({
            infoData: devInfo,
            devItem: devItem
          });

          this.initExamDetails(devInfo.devName);
          this.loadFeatureList();
        }
      }) 
  } 

  //加载设备验收详情
  initExamDetails = (devName) => {
    let params = {
      billType: billType,
      contId: this.state.infoData.contractId,
      devId: this.state.infoData.devId
    };  
    //查询检查内容
    ajax.getJSON(
      checkItemUrl, 
      params, 
      (itemData) => {
      let backData = itemData.backData; 
      if(backData && backData.length > 0) {
        let tmp = [];
        for(let i = 0; i < backData.length; i++) {
          let o = {
            // num: i,
            // itemId: backData[i].id,
            // checkItemName: backData[i].checkContent,
            // examDesc: '合格',
            // examResult: 1,
            // attachesList: []
            pid: backData[i].pid,
            id: backData[i].id,
            dictCkId: backData[i].id,
            examResult: 1,
            checkItemName: backData[i].checkContent,
            checkSeril: backData[i].checkSeril,
            attaches: '',
            attachesList: [],
            result: null,
            isCorrect: null,
            examDesc: '合格'
          };
          o.delImg = (img) =>{
            let that = this;
            setTimeout(() => {
              that.attaches.remove(img);
            }, 100);
          };
          tmp.push(o);
        }
        this.setState({
          examDetails: tmp
        });
      } 
    })
  } 

  //特征项
  loadFeatureList = () =>{
    let param_feature = {
      devId: this.state.infoData.devId
    }; 
    ajax.getJSON(
      featureUrl, 
      param_feature, 
      (data) =>{
      let backData = data.backData;
      for (let i = 0; i< backData.length;i++) {
        backData[i].featureCodeName = null;

        let params_feature = {
          defdoclistCode: backData[i].featureCode
        };
        ajax.getJSON(
          featurerangeUrl, 
          params_feature, 
          (sub_data) => {
            let subBackData = sub_data.backData;
            let array = [];
            for (let j = 0; j < subBackData.length; j++){ 
               var o = { 
                value: subBackData[j].def1 + '&&&' + subBackData[j].code,
                label: subBackData[j].name
              } 
              array.push(o)
            }
            backData[i].featureRangeList = array;
            backData[i].featureCodeValueSelected = null;

            this.setState({
              featureValue: backData
            });
        }) 
      }
      this.setState({
        featureValue: backData
      });
      console.log('loadFeatureList backData == ', backData);
    });
  } 

  //管控层级
  getLevelControlList = () =>{
    let paramFeature = {
      defdoclistCode: "19_device_102",
      condition: 'null'
    };
    ajax.getJSON(
      featurerangeUrl, 
      paramFeature, 
      (data) => {
      let backData = data.backData;
      console.log('levelControlList == ', backData)
      this.setState({
        levelControlList: backData
      });
    })
  } 

  //特征值范围
  featureChange = (item, index, v) => { 
    console.log('v == ', v);
    item.featureCodeValueSelected = v[0];
    item.featureCodeValue = v[0].split('&&&')[1];
    item.levelControl = v[0].split('&&&')[0].split(',')[1]; 
    item.featureRangeList.map(function(_item, _index){
      if(_item.value === v[0])
        item.featureCodeName = _item.label;
    });
    let { featureValue } = this.state;
    featureValue[index] = item; 
    this.setState({
      featureValue,
    });
    this.calcLevel(item.levelControl);
  } 

  //计算管控层级
  calcLevel = (code) => {
    if(typeof code == 'string') {
      let { levelControlList, featureValue } = this.state;
      for(var i = 0; i < featureValue.length; i++) {
        if(featureValue[i].levelControl && parseInt(code) < parseInt(featureValue[i].levelControl)) {
          code = featureValue[i].levelControl;
        }
      }
      levelControlList.map((item, index) => {
        if(item.code === code){
          this.setState({
            levelControl: item.name
          });
        }
      });
      
    } else {
      Toast.info('编码有误');
    }
  }

  //附件下载事件 
  getAttachList = (id, imgArray, type, callback) => {
    let params = {
      id: id,
      billType: 'DEN01',
      type: type
    };
     files.filesDownLoad(imgArray, params, callback);
  } 

  //附件上传删除事件
  delImg = (type, img) => {
    let that = null; 
    if(type == 11) {
      that = this.state.makeFile;
    } else if(type == 12) {
      that = this.state.productFile;
    } else if(type == 13) {
      that = this.state.checkFile;
    } else if(type == 14) {
      that = this.state.recordFile;
    } else {
      that = this.state.instructionFile;
    }
    setTimeout(() => {
      let param = {
        id: this.props.params.id,
        billType: 'DEN01',
        sourceType: type,
        attachIds: img.gid
      };
      // Files.fileDelByGid(param);
      that.attaches.remove(img);
    }, 100);
  } 

  //附件上传事件
  onFilesChange = (subIndex, subItem, fileList, type, index) => {
    console.log('this.state.examDetails === ', this.state.examDetails); 
    console.log('subIndex === ', subIndex);
    console.log('subItem === ', subItem);
    console.log('fileList === ', fileList);
    console.log('type === ', type);
    console.log('index === ', index);
    let { examDetails } = this.state; 
    if(type === 'add'){
      let source = {};
      source.sourceId = null;
      source.sourceType = '102345678';
      Toast.loading('正在上传...', 0);
      files.multiFilesUpLoad(
        examDetails[subIndex], 
        fileList, 
        "DC01", 
        authToken, 
        source,
        (data) => {
          console.log('callback data === ', data);
          examDetails[subIndex].attachesList = data.attachesList;
          this.setState({
            examDetails,
          });
          Toast.hide();
        }
      );
    }else {
      let attachesList = examDetails[subIndex].attachesList;
      attachesList.splice(index, 1);
      examDetails[subIndex].attachesList = attachesList;
      this.setState({
        examDetails,
      });
    }
  } 

  //返回
  callback = () =>{
    this.context.router.goBack();
  }  

  //合格
  btnPassState = (subIndex,obj) => {  
    let {examDetails} = this.state;
    examDetails[subIndex].examResult = obj.examResult ===2?1:2 
    this.setState({
      examDetails
    })
  } 

  //不合格
  btnUnPassState = (subIndex,obj) => { 
    let {examDetails} = this.state;
    examDetails[subIndex].examResult = obj.examResult ===1?2:1 
    this.setState({
      examDetails
    })
  } 

  //自定义验收新增事件
  addSelfDetails = () => {  
    const selfDefineDetails = this.state.selfDefineDetails; 
    const o = {
        billSourceId: null,
        billSourceSubId: null,
        checkContent: '',
        dr: 0,
        examDesc: null,
        examResult: 1,
        id: null,
        memo: null,
        spotId: '',
        vostate: 0,
        qualified: true
    } 
    selfDefineDetails.push(o) ; 
    this.setState({
      selfDefineDetails:selfDefineDetails
    })
  } 

  //自定义验收删除事件 
  removeSelfDetails = (item,index) => {
     const selfDefineDetails = this.state.selfDefineDetails;   
    delete selfDefineDetails[index];
     this.setState({
      selfDefineDetails:selfDefineDetails
     })
  } 

  //自定义验收合格
  selfBtnPassState = (subIndex,obj) => {  
    let {selfDefineDetails} = this.state; 
    selfDefineDetails[subIndex].examResult = obj.examResult ===2?1:2 
    this.setState({
      selfDefineDetails
    })
  } 

  //自定义验收不合格
  selfBtnUnPassState = (subIndex,obj) => { 
    let {selfDefineDetails} = this.state; 
    selfDefineDetails[subIndex].examResult = obj.examResult ===1?2:1 
    this.setState({
      selfDefineDetails
    })
  }   

  //打开编辑窗口
  openEditWindow = () => {
    this.setState({
      isShowDeviceRef: true,
      isShowBrandRef: false, 
    }); 
  } 

   //打开品牌参照
  openDevbrandRef = () => { 
    console.log(this)
    this.setState({
      isShowBrandRef: true, 
    }); 
  } 

  //回调品牌信息
  submitBrandRef = (brandInfo,type) => {   
    switch(type){
      case 'open':
        this.setState({
          psnName:brandInfo.shortname,
          isShowBrandRef: false
        });
      case 'close':
        this.setState({
          isShowBrandRef:false
        });
      default:
      ;
    }
  } 

  //关闭
  closeRefWindow = () => {
    this.setState({
      isShowDeviceRef: false,
      isShowBrandRef: false 
    }); 
  } 

  //保存修改
  saveData = (devItem) => { 
    let data = this.state.data; 
    devItem.prodTime = new Date(data.reportTime).getTime();;
    devItem.makerName = this.state.psnName;
    this.setState({
      devItem:devItem,
      isShowDeviceRef: false 
    }); 
  } 

  //保存提交
  doSubmit = () => { 
    //基础信息
    let submitData = {};
    let notice = this.state.infoDataSubmit.notice;
    let devListSub = notice.devList;
    let devItemSub = notice.devItem;
    submitData.attachMgr = null;
    submitData.billCode = notice.billCode;
    submitData.billDate = null;
    submitData.billSourceId = null;
    submitData.billState = notice.billState;
    submitData.billType = null;
    submitData.bpmid = null;
    submitData.companyId = notice.companyId;
    submitData.contractId = notice.contactId;
    submitData.contractName = notice.contractName;
    submitData.contractNameRef = null;
    submitData.contractNo = notice.contractNo;
    submitData.createtime = notice.createtime;
    submitData.creator = notice.creator
    submitData.creatorid = notice.creatorid;
    submitData.defCheckContents = [];
    submitData.description = ''; 
    submitData.devCatId = devListSub.devCatId;
    submitData.devId = devListSub.devId;
    submitData.devModel = devListSub.devModel;
    submitData.devName = devListSub.devName;
    submitData.devNo = devListSub.devNo;
    submitData.enntfDevId = null;
    submitData.enntfDevName = devListSub.devName;  
    submitData.equityComp = devItemSub.equityComp; 
    submitData.equityCompRef = null;
    submitData.equityType = devItemSub.equityType; 

    //自定义验收
    submitData.defCheckContents = null; 
     
    //验收内容
    submitData.examDetail = this.state.examDetails; 
    submitData.examStaffRef = null ;
    submitData.examTime = null ;
    submitData.examUserId = notice.creatorid ;  
    submitData.examUserName = notice.creator ; 
    submitData.factoryNo = null ;

    //特征值
    submitData.featureItems= this.state.featureValue;

    //其他信息
    submitData.filNo = null;
    submitData.id = notice.spotId;
    submitData.isExist = null;
    submitData.levelControl = '';
    submitData.mainParam = devItemSub.mainParam;
    submitData.maker = devItemSub.maker;
    submitData.mark = null;
    submitData.matAlmCircle = null;
    submitData.matAlmTime = null;
    submitData.matCircle = null;
    submitData.matTime = null;
    submitData.mfclipc = null;
    submitData.mfcsup = null;
    submitData.memo = null;
    submitData.mfclipc = null;
    submitData.mfcsup = '';
    submitData.mgNo = null;
    submitData.mgNoCode = null; 
    submitData.modifier = notice.modifier;
    submitData.modifierid = notice.modifierid;
    submitData.modifytime = notice.modifytime;
    submitData.pdcqlc = null;
    submitData.pjtId = notice.projectId; 
    submitData.pjtName = notice.projectName;
    submitData.power = devItemSub.power;
    submitData.prodTime = devItemSub.prodTime;
    submitData.recpro =''; 
    submitData.respUserId = null;
    submitData.respUserName = null;
    submitData.respUserRef = null;
    submitData.reviewer = notice.reviewer;
    submitData.reviewerid = notice.reviewerid;
    submitData.reviewtime = null;
    submitData.sourceBillType = null;
    submitData.supplierId = notice.supplierId;
    submitData.supplierName = notice.supplierName;
    submitData.supplierNameRef = null;
    submitData.tenantid = null;
    console.log(submitData);
    ajax.postJSON(
      saveUrl, 
      JSON.stringify(submitData),
      data => {
        if(data.success) {
          console.log(data); 
        } 
      } 
    ); 
  } 
  
  render() {
    const {projectInfo, data, value, psnName, isShowBrandRef, isShowDeviceRef, arritem ,btnstate, array, featurRange, infoData, devItem, levelControl, featureValue, examDetails, selfDefineDetails, makeFile, productFile, checkFile, recordFile, instructionFile, pickerList} = this.state;
    const examUserName = authToken.getUserName()
    const respUserName = authToken.getUserName()
    const resultList = [
      {
        value: 1,
        label: '合格'
      }, {
        value: 2,
        label: '不合格'
      }]; 
    const that = this; 
    let headerClass = `ref-window ${ isShowDeviceRef ? 'active' : '' }`;
    const makeImg = <YYShowAttachesList attachesList = {makeFile.attachesList} />;
    const productImg = <YYShowAttachesList attachesList = {productFile.attachesList} />;
    const checkImg = <YYShowAttachesList attachesList = {checkFile.attachesList} />;
    const recordImg = <YYShowAttachesList attachesList = {recordFile.attachesList} />;  
    const instructionImg = <YYShowAttachesList attachesList = {instructionFile.attachesList} />;   
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
              <div onClick={ () => {
                  this.doSubmit(); 
                }}>提交</div>
              }
          >设备进场验收</NavBar>
        <div className='zui-content zui-scroll-wrapper'>
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
              <List className="my-list">
                <List.Item thumb={<span className="icon-device icon-device-contract"></span>} extra={infoData.contractName}>合同名称</List.Item>
                <List.Item thumb={<span className="icon-device icon-device-project"></span>} extra={projectInfo.name}>项目名称</List.Item>
                <List.Item thumb={<span className="icon-device icon-device-equipment"></span>} extra={devItem.sdevName}>设备名称</List.Item>
                <List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} extra={infoData.mgNo}>设备管理编号</List.Item> 
                <DatePicker
                  mode="date"
                  title="选择日期"
                  extra="请选择"
                  value={infoData.examTime}
                  onChange={
                    (date) => {
                      infoData.examTime = date;
                      this.setState({ infoData:  infoData});
                    }
                  }
                >
                <List.Item thumb={<span className="icon-device icon-device-inDate"></span>} arrow="horizontal">验收日期</List.Item>
                </DatePicker>
                <List.Item thumb={<span className="icon-device icon-device-workEmployer"></span>} extra={levelControl}>管控层级</List.Item>
              </List>
            </Accordion.Panel>
          </Accordion>

          <div className='zui-pane'>
            <h2 className='zui-pane-title'>特征值信息</h2>
          </div>
          {
            featureValue.map(function(item, index){
              return <div key = {index}>
                        <h4 style={{padding: '5px 0 5px 15px',fontStyle: 'italic',margin: '5px 0'}}>{ index + 1 }</h4>
                        <List className="my-list">
                          <List.Item extra={item.featureName}>特征项</List.Item>
                          <Picker  
                            data={item.featureRangeList} 
                            cols={1}
                            extra="请选择"
                            value= {[item.featureCodeValueSelected]}
                            onChange={v => that.featureChange(item, index, v)}
                          >
                           <List.Item arrow="horizontal">特征值范围</List.Item>
                          </Picker> 
                          {item.featureIsEmpty == true ?
                            <List.Item extra={<input type='text' size='15px' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={'请输入特征值'}></input>}
                            >
                            特征值</List.Item>:''}
                        </List>
                     </div>
            })
          }

           <div style={{marginTop: '10px'}}>
              <Tabs tabs={tabs}
                initialPage={0}
                swipeable={false}
                onChange={(tab, index) => { console.log('onChange', index, tab);}}
                onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}>

                <div>
                  <ul className="zui-list-unstyled device-base-info">
                    <li>
                      <span>设备名称</span>
                      <span>{devItem.sdevName}</span>
                    </li>
                    <li>
                      <span>设备型号</span>
                      <span>{devItem.sdevModel}</span>
                    </li>
                    <li>
                      <span>主要参数</span>
                      <span>{devItem.mainParam}</span>
                    </li>
                    <li>
                      <span>功率</span>
                      <span>{devItem.power}</span>
                    </li>
                    <li>
                      <span>出厂日期</span>
                      <span>{Util.FormatDate(devItem.prodTime,'date')}</span>
                    </li>
                    <li>
                      <span>品牌</span>
                      <span>{devItem.makerName}</span>
                    </li>
                    <li>
                      <span>出厂编号</span>
                      <span>{devItem.factoryNo}</span>
                    </li>
                    <li>
                      <span>备案编号</span>
                      <span>{devItem.filNo}</span>
                    </li>
                    <li>
                      <span>产权单位</span>
                      <span>{devItem.equityComp}</span>
                    </li>
                    <li>
                      <span>产权性质</span>
                      <span>{devItem.equityType}</span>
                    </li>
                    <li>
                      <span>备注</span>
                      <span>{devItem.memo}</span>
                    </li>
                  </ul>
                  <div className="footer-btn-group" style={{position:'relative'}}> 
                    <div className="btn" onClick={that.openEditWindow}>编辑修改</div>
                  </div>  
                </div>

                <div style={{backgroundColor:'#fff'}}>
                  {                           
                    examDetails.map(function(subItem, subIndex){
                        return  <div key={subIndex} className="content-details index-list" style={{marginTop:'-16px'}}>
                                  <div className="wrap-index" style={{paddingTop:'16px'}}>
                                    <p className="index-text hair-line-bottom">
                                      <span className="iconfont icon-project text-green"></span>
                                      <span>{subItem.checkItemName}</span>
                                    </p>
                                    <div className="hair-line-bottom" style={{marginBottom: '5px', paddingLeft: '15px', paddingRight: '15px'}}>
                                      <p>验收详情</p>
                                      <TextareaItem
                                        defaultValue={subItem.examDesc}
                                        placeholder="请输入验收内容..."
                                        autoHeight
                                        // {onBlur={ (val) => that.saveComment(pIndex, subIndex, subItem, val)}}
                                      />                   
                                    </div>
                                    <ImagePicker
                                      files={subItem.attachesList}
                                      onChange={(files, type, index) => {
                                        that.onFilesChange(subIndex, subItem, files, type, index);
                                      }}
                                      onImageClick={(index, fs) => console.log(index, fs)}
                                      selectable={true}
                                      multiple={true}
                                    /> 
                                    <div className='btn-group hair-line-bottom add'>
                                      <Flex>
                                        <div style={{width:'100%',height:'100%'}}>  
                                          <div onClick={() => that.btnUnPassState(subIndex,subItem)} className={subItem.examResult ==1?'btnstate2':'btnstate3'}>不合格</div>  
                                        </div>
                                        <div style={{width:'100%',height:'100%'}}>            
                                          <div onClick={() => that.btnPassState(subIndex,subItem)} className={subItem.examResult ==1?'btnstate1':'btnstate2'}>合格</div> 
                                        </div>                  
                                      </Flex>
                                    </div>

                                  </div>
                                </div>
                            })
                          }
                  </div>

                  <div>  
                    {selfDefineDetails.map(function(item,index){
                       return <div key={index} style={{backgroundColor:'#fff'}}>
                               <div  className="content-details index-list" style={{marginTop:'-16px'}}>
                                <div className="wrap-index" style={{paddingTop:'16px'}}>
                                   <p className="index-text hair-line-bottom">
                                     <span className="iconfont icon-project text-green"></span>
                                     <span><input type='text' size='30' style={{textAlign:'left',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={'请输入自定义检查内容'}></input></span> 
                                     <span onClick ={() => that.removeSelfDetails(item,index)} className="iconfont icon-delete delItem-btn text-green" style={{float:'right',marginTop:'-3px',marginLeft:'-5px',marginRight:'5px'}}></span>
                                   </p> 
                                   <div className="hair-line-bottom" style={{marginBottom: '5px', paddingLeft: '15px', paddingRight: '15px'}}>
                                     <p>验收详情{index}</p>
                                     <TextareaItem
                                      defaultValue={''}
                                      placeholder="请输入验收内容..."
                                      autoHeight
                                      // {onBlur={ (val) => that.saveComment(pIndex, subIndex, subItem, val)}}
                                    />                   
                                  </div>
                                   <div className='btn-group hair-line-bottom add' style={{backgroundColor:'#fff'}}>
                                    <Flex>
                                      <div style={{width:'100%',height:'100%'}}>  
                                        <div onClick={() => that.selfBtnUnPassState(index,item)} className={item.examResult ==1?'btnstate2':'btnstate3'}>不合格</div>  
                                      </div>
                                      <div style={{width:'100%',height:'100%'}}>            
                                        <div onClick={() => that.selfBtnPassState(index,item)} className={item.examResult ==1?'btnstate1':'btnstate2'}>合格</div> 
                                      </div>                  
                                    </Flex>
                                  </div>

                                </div>
                              </div>  
                          </div>  
                    })
                  }
                    <div className='custom' onClick ={() => that.addSelfDetails()}>
                      <span className="iconfont icon-add"></span>
                      <span style={{}}>添加自定义验收项</span>
                    </div>
                  </div>

                  <div>
                    <List className="my-list">
                      <List.Item extra={examUserName}>验收人员</List.Item> 
                      <List.Item extra={respUserName}>责任人</List.Item>
                      <List.Item extra={
                        <input type='text' size='10' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={''}></input>}>
                          保养周期
                      </List.Item>
                      <List.Item extra={
                        <input type='text' size='10' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={''}></input>}>
                          保养台时
                      </List.Item>
                      <List.Item extra={
                        <input type='text' size='10' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={''}></input>}>
                          保养预警周期
                      </List.Item>
                      <List.Item extra={
                        <input type='text' size='10' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={''}></input>}>
                          保养预警台时
                      </List.Item>
                    </List>
                  </div>

              </Tabs>
           </div>
          </div>  
            <div className={headerClass}>
              <NavBar 
                  mode="light"
                  icon={<Icon type="cross" />}
                  leftContent="关闭" 
                  onLeftClick={that.closeRefWindow}
                  rightContent={
                  <div onClick={ () => {
                      this.saveData(devItem); 
                    }}>保存</div>
                  }
                >设备信息</NavBar>
                <div className = "zui-content sys-scroll">
                  <List className="my-list">
                    <List.Item extra={devItem.sdevName ==null?'':devItem.sdevName}>设备名称</List.Item>
                    <List.Item extra={devItem.sdevModel}>设备型号</List.Item>
                    <List.Item extra={
                      <TextareaItem 
                        style={{backgroundColor: '#f0f0f0',textAlign: 'right'}}
                        autoHeight 
                        labelNumber={10} 
                        value = {devItem.mainParam}  
                        onChange={
                            (value) => {
                              devItem.mainParam = value;
                              this.setState({ devItem:  devItem});
                            }
                          }
                      >
                      </TextareaItem>
                    }>主要参数</List.Item>
                    <List.Item extra={
                      <InputItem 
                        placeholder = '请输入功率' 
                        value={devItem.power} 
                        onChange={
                            (value) => {
                              devItem.power = value;
                              this.setState({ devItem:  devItem});
                            }
                          }>
                      </InputItem>
                    }>功率</List.Item>
                    <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="请选择"
                        value={data.reportTime}
                        onChange={
                          (date)=> {
                            data.reportTime = date;
                            this.setState({ data:  data});
                          }
                        }
                        >
                      <List.Item arrow="horizontal">出厂日期</List.Item>
                    </DatePicker>
                    <List.Item arrow="horizontal" onClick = {this.openDevbrandRef} extra={psnName ? psnName : '请选择'}>品牌</List.Item>
                    <List.Item extra={
                      <TextareaItem 
                        style={{backgroundColor: '#f0f0f0',textAlign: 'right'}}
                        autoHeight 
                        labelNumber={5} 
                        value = {devItem.equityComp}
                        onChange={
                          (value)=> {
                            devItem.equityComp = value;
                            this.setState({ devItem:  devItem});
                          }
                        }>
                      </TextareaItem>
                    }>产权单位
                    </List.Item>
                    <List.Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入出厂编号' 
                          value={devItem.factoryNo} 
                          onChange={
                            (value)=> {
                              devItem.factoryNo = value;
                              this.setState({ devItem:  devItem});
                            }
                          }>
                        </InputItem>}>出厂编号
                    </List.Item>
                    <List.Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入产权性质' 
                          value={devItem.equityType} 
                          onChange={
                            (value)=> {
                              devItem.equityType = value;
                              this.setState({ devItem:  devItem});
                            }
                          }>
                        </InputItem>}>产权性质
                    </List.Item>
                    <List.Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入备案编号' 
                          value={devItem.filNo} 
                          onChange={
                            (value)=> {
                              devItem.filNo = value;
                              this.setState({ devItem:  devItem});
                            }
                          }>
                        </InputItem>}>备案编号
                    </List.Item>
                  </List>
                  <div className='zui-pane'>
                    <h2 className='zui-pane-title'>设备附件</h2>
                  </div>
                  <List className="my-list">
                    <List.Item>
                      <p style = {{margin:'0',padding:'10px'}}>制造许可证</p>
                      {makeImg}
                    </List.Item>
                    <List.Item>
                      <p style = {{margin:'0',padding:'10px'}}>产品合格证</p>
                      {productImg}
                    </List.Item>
                    <List.Item>
                      <p style = {{margin:'0',padding:'10px'}}>制造监督检验证明</p>
                      {checkImg}
                    </List.Item>
                    <List.Item>
                      <p style = {{margin:'0',padding:'10px'}}>备案证明</p>
                      {recordImg}
                    </List.Item>
                    <List.Item>
                      <p style = {{margin:'0',padding:'10px'}}>使用说明书</p>
                      {instructionImg}
                    </List.Item>
                  </List>
                </div>

            </div>

          <DevBrandRef submitBrandRef={ this.submitBrandRef } isShowBrandRef={ isShowBrandRef } />
      </div>
    );
  }
} 

DeviceAcceptAdd.contextTypes = {  
     router:React.PropTypes.object  
}  

export default DeviceAcceptAdd;
