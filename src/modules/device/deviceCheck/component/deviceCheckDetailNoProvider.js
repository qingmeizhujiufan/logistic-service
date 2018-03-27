import React from 'react';
import { NavBar, Icon, Accordion, List, Toast, DatePicker, TextareaItem, Picker, ImagePicker,InputItem} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceCheck.less';

/* 引入自定义公共组件 */
import YYPane from 'Comps/yyjzMobileComponents/yyPane';
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';
import PsnRef from '../../../pub/refs/component/psnRef';


const queryDetailUrl = MODULE_URL.DEVCONT_BASEHOST + '/deviceCheck/queryDetail';
const checkitemsUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/checkitems';
const correctionInfoUrl = MODULE_URL.DEVCONT_BASEHOST + "/emElmDevCheck/correct";
const updateUrl = MODULE_URL.DEVCONT_BASEHOST + "/deviceCheck/update";
const correctShowUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/showHistory';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// 定义复查结果数组
const reviewResultArr = [{
  value:1,
  label:'未复查'
},{
  value: 2,
  label: '复查通过',
},{
  value: 3,
  label: '复查不通过'
}];


class DeviceCheckDetailNoProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCorWindow:false,
      isShowReviewWindow:false,
      data: {},
      checkDetails: [],
      backData: {},
      isShowPsnRef:false, 
      isShowRecRef:false,
      files: [],
      value:'',
      itemData:{},
      recData:[],
      attachesList:[],
      recImgList:[],
      review:{},
      reviewTable:[],
      reviewObj: {},
    };
  }

  componentWillMount() {
    let param = {
      id: this.props.params.id,
      dealRecent: 1
    };
    ajax.getJSON(
      queryDetailUrl,
      param,
      data => {
        var backData = data.backData;
        console.log("backData==",backData);
          if(backData) {
            backData.examPerson = backData.examId ? backData.examId.name : '';
            var params = {
              billType: 'DC01',
              checkType: backData.checkType.code,
              contId: backData.contId,
              devId: backData.devId, 
            };
            var editTable = backData.editTable;
            var reviewTable = backData.reviewTable;
            //查询检查内容
            Toast.loading('正在加载检查内容...', 0);
            ajax.getJSON(
              checkitemsUrl, 
              params, 
              itemData => {
              var itemData = itemData.backData;
              if(itemData && itemData.length > 0) {
                var items = [];
                var itemDetails = [];
                let len = itemData.length;
                for(let i = 0; i < len ; i++) {
                  var o = {
                    pid: itemData[i].pid,
                    key: itemData[i].id,
                    id: itemData[i].id,
                    dictCkId: itemData[i].id,
                    checkBillId: null,
                    checkContent: itemData[i].checkContent,
                    checkSeril: itemData[i].checkSeril,
                    examDesc: null,
                    examResult: 1,
                    examState: backData.examState,
                    isCorrect: 0,
                    comment: null,
                    result: 1,
                    requirement: ''
                  }

                  for(var j = 0, len1 = editTable.length; j < len1; j++) {
                    if(editTable[j].dictCkId === itemData[i].id) {
                      o.id = editTable[j].id;
                      o.checkBillId = editTable[j].checkBillId;
                      o.examState = backData.examState;
                      o.isCorrect = editTable[j].isCorrect;
                      o.comment = editTable[j].comment;
                      o.result = editTable[j].result;
                      o.requirement = editTable[j].requirement;
                    }
                  }
                  items.push(o);
                }
                if(items.length > 0){
                  items.forEach(function(item) {
                    if(!item.pid) {
                      itemDetails.push(item);
                    }
                  });
                  
                  items.forEach(function(sub) {
                    if(itemDetails.length > 0){
                      itemDetails.forEach(function(par, index) {
                        if(sub.pid === par.dictCkId) {
                          if(!par.children)
                            par.children = [];
                          par.children.push(sub);
                        }
                      });
                    }
                    
                  });
                }
                itemDetails.map(function(item, index){
                  item.children = item.children || [];
                });
                if(backData.examState === 3 && itemDetails.length > 0 && reviewTable.length > 0){
                  let that = this;
                  itemDetails.forEach(function(first) {
                    first.children.forEach(function(second) {
                      reviewTable.forEach(function(third) {
                        if(third.dictCkId === second.dictCkId) {
                          second.correctInfo = third;
                          second.correctInfo.attachesList = [];
                          let params = {
                            id: second.correctInfo.checkBillId,
                            billType: 'DC01',
                            type: second.correctInfo.id + '_attaches'
                          };
                          Files.filesDownLoad(second.correctInfo, params, () => {
                              that.setState({
                                checkDetails: itemDetails
                              });
                          });
                        } 
                      });
                      if(second.result === 0){
                        first.hasRectify = 1;
                      }         
                    });
                  });
                }
                console.log('itemDetails =1111111== ', itemDetails);
                this.setState({
                  backData: backData,
                  checkDetails: itemDetails,
                  reviewTable: backData.reviewTable
                });

                this.getAttachList(itemDetails, () => {
                  this.setState({
                    checkDetails: itemDetails
                  });
                });
              }
              Toast.hide();
            });
            
            this.setState({
              data: data.backData
            });
          }

        this.setState({
          data: backData
        });
      }
    );
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
        Files.filesDownLoad(sub, params, callback);
      });
    });
  }

// 显示整改页面
  showCorWindow = (item, index, subItem, subIndex) => {
     let {files,reviewObj, reviewTable} = this.state;
     const curReviewObj = {
      dictCkId: subItem.dictCkId,
      id: subItem.id,	
      requirement: '',
      reviewDate: now,
      reviewResult: {
        value: 1,
        label: '未复查'
      },
      content: '',
      reviewerId: {},
      indexObj: {
        pItem: item,
        pIndex: index,
        subItem: subItem,
        subIndex: subIndex
      },
      attachesList: [],
     };
     reviewObj = subItem.reviewObj || curReviewObj;

     reviewTable.forEach(function(reviewItem, index){
      if(reviewItem.dictCkId === subItem.dictCkId){
        reviewObj.requirement = reviewItem.requirement;
        return;
      }
     });
     this.setState({
      reviewObj,
      isShowRecRef: true
     });
  }
//回调人员参照返回的值
  submitPsnRef = (psnInfo,type) => {
    switch(type){
      case 'open':
        let {reviewObj} = this.state;
        let reviewerId = {
          id: psnInfo.id,
          name: psnInfo.name,
          code: psnInfo.code
        };
        reviewObj.reviewerId = reviewerId;
        this.setState({ 
          reviewObj,
          isShowPsnRef: false, 
        });
      case 'close':
        this.setState({
          isShowPsnRef: false
        });
      default: ;
    }
     
  }

  //保存复查情况
  saveReviewContent = (value) => {
    let { reviewObj } = this.state;
    reviewObj.content = value;
    this.setState({
      reviewObj,
    });
  }
  //保存复查详情
  submitReformWindow = () => {
    let {checkDetails, reviewObj, reviewTable} = this.state;
    const {pIndex, subIndex} = reviewObj.indexObj;
    console.log("保存 reviewObj==",reviewObj);
    if(JSON.stringify(reviewObj.reviewerId) === "{}"){
      Toast.info('请选择复查人！', 1);
      return;
    }
    if(reviewObj.content === ''){
      Toast.info('请输入复查情况！', 1);
      return;
    }
    //将数据保存到checkDetails里，方便读取

    checkDetails[pIndex].children[subIndex].reviewObj = reviewObj;
   
    //将数据保存到reviewTable里，需要提交
    reviewTable.forEach(function(item, index){
      if(reviewObj.dictCkId === item.dictCkId){
        item.isEdit = true;
        item.rowState = 'edit';
        item.reviewerId = reviewObj.reviewerId;
        item.reviewDate = Util.FormatDate(reviewObj.reviewDate,'date');
        item.reviewState = reviewObj.reviewResult ? reviewObj.reviewResult.value : 1;
        item.content = reviewObj.content;
        item.attachObjs = []; 
        let attach = reviewObj.attachesList;
        let gidd = []; 
        attach.forEach(function(items){
           gidd.push(items.gid)
        });

        for(var i=0; i<gidd.length; i++) {
            var imgArray = {
              attachMgr:gidd[i],
              sourceType:"attaches"
            }; 
            (item.attachObjs).push(imgArray)
          }
      }
    });
    this.setState({
      checkDetails,
      reviewTable,
      isShowRecRef: false
    });

  }

  //复查附件上传
  onFilesChange = (files, type, index) => { 
    let {reviewObj, reviewTable} = this.state;
    
    if(type === 'add'){
      let source = {}; 
      reviewTable.forEach(function(item, index){
        if(reviewObj.dictCkId === item.dictCkId){
           source.sourceId = item.checkBillId;
           source.sourceType = item.id+'_attaches';
        }
      }); 
      Toast.loading('正在上传...', 0);
      Files.multiFilesUpLoad( 
        reviewObj,
        files,
        "DC01", 
        authToken, 
        source,
        (data) => {
          reviewObj.attachesList = data.attachesList;
          console.log("附件上传==",reviewObj);
          this.setState({
            reviewObj,
          });
          Toast.hide();
      })
    }else {
        let attachesList = reviewObj.attachesList;
        // 远程删除
        let param = {
          id: this.props.params.id,
          billType: 'DEN01',
          sourceType: type,
          attachIds: attachesList[index].gid
        };
        Files.fileDelByGid(param);
        // 删除本地
        attachesList.splice(index, 1);
        reviewObj.attachesList = attachesList;
        this.setState({
          reviewObj,
        });
    }
  }
// 关闭复查项页面
  closeCorWindow = () => {
     this.setState({isShowRecRef: false});  
  }
// 打开复查人员参照页面
  chooseReformPersonWindow = () => {
    this.setState({
      isShowPsnRef: true
    });
  }
// 监听折叠面板状态
  onChange = (files, type, index) => {
    // console.log(files, type, index);
    this.setState({
      files,
    });
  }

  //提交
  handleSubmit = () => {
    let {backData, reviewTable} = this.state;
    console.log("handleSubmit backData==",backData);
    let isWriteFull = true;//判断是否填完所有的复查项
    reviewTable.forEach(function(item, index){
      if(item.reviewDate === null || item.reviewerId === null || item.content === null || JSON.stringify(item.reviewerId) === "{}" ||item.content === '')
      {
        isWriteFull = false;
      }
    });
    if(!isWriteFull){
      Toast.info('请填写所有的复查项！', 1);
        return;
    }
    let postData = backData;
    postData.billState = 3;
    postData.checkType = backData.checkType.code;
    postData.mgNo = {
      id: backData.spotId,
      name: backData.mgNo
    };
    postData.projectId = backData.projectId.name;
    postData.reviewTable = reviewTable;
    console.log('提交数据==',postData);
    // return;
    Toast.loading('正在提交...', 0);
    ajax.postJSON(
      updateUrl,
      JSON.stringify(postData),
      (data) => {
        console.log('callback data === ', data);
        if(data.success){
          Toast.hide();
          this.context.router.goBack('device/deviceCheckListNoProvider');
        }
      });
  }
// 返回的回调函数
  callback = () => {
    this.context.router.goBack();
  }


  render() {
    let { 
      data, 
      checkDetails, 
      isShowCorWindow, 
      isShowReviewWindow, 
      value, 
      isShowPsnRef,
      isShowRecRef,
      reviewObj} = this.state;
    let that = this;
    let recheaderClass = `ref-window ${ isShowRecRef ? 'active' : '' }`;  
    let recImgList = this.state.recImgList || {};
    let replyImgList = this.state.replyImgList || {}; 
    let replyCrrImgList = this.state.replyCrrImgList || {};

    let baseInfoList = [{
      label: '检查人员',
      value: data.creator
    }, {
      label: '检查时间',
      value: data.examTime
    }, {
      label: '设备管理编号',
      value: data.mgNo
    }, {
      label: '设备名称',
      value: data.devName
    }, {
      label: '设备型号',
      value: data.devModel
    }, {
      label: '合同名称',
      value: data.contractName
    }, {
      label: '检查类型',
      value: data.checkType ? data.checkType.name : ''
    }, {
      label: '项目名称',
      value: data.projectId ? data.projectId.name : ''
    }, {
      label: '巡检结果',
      value: data.result === 1 ? '合格' : '不合格'
    }, {
      label: '检查状态',
      value: data.examState ==1?'待整改':(data.examState ==2?'待复查':(data.examState==3?'已完成':''))
    }];

    function correctDetail(subItem){
      return [
        {
          label: '复查人',
          value: subItem.correctInfo.reviewerId ? subItem.correctInfo.reviewerId.name : ''
        }, {
          label: '复查时间',
          value: subItem.correctInfo.reviewDate
        }, {
          label: '复查情况',
          value: subItem.correctInfo.content
        }
      ]
    }

    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
            <div onClick={this.handleSubmit} className={data.billState==3?'hide-submit':''}>提交</div>
          }
        >设备检查详情(无供方)</NavBar>
        <div className="zui-content zui-scroll-wrapper DeviceCheckDetailNoProvider">
          <div className="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <YYBaseInfo baseInfoList={baseInfoList} />
              </Accordion.Panel>
            </Accordion>
            <YYPane title={'检查内容'} />
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            {
              checkDetails.map(function(item, index){
                  return  <Accordion.Panel key={index} header={(index + 1) + '、' + item.checkContent} style={{'backgroundColor': '#f5f5f5'}}>
                            {                           
                              item.children.map(function(subItem, subIndex){
                                  return  <div key={subIndex} className="content-details index-list">
                                            <div style={{'padding': '10px 15px', 'fontStyle': 'italic', 'fontSize': 16, 'fontWeight': 500, 'backgroundColor': '#f8f8f8'}}>{subIndex + 1}</div>
                                            <div className="wrap-index">
                                              <p className="index-text hair-line-bottom">
                                                <span className="iconfont icon-project text-green"></span>
                                                <span>{subItem.checkContent}</span>
                                              </p>
                                              <div className="index-detail">
                                                <p className="text-green">检查详情</p>
                                                <div className="index-detail-comment">{subItem.comment}</div>
                                                  <YYShowAttachesList attachesList = {subItem.attachesList} />
                                                {
                                                  (function(subItem){
                                                      if(subItem.result !== 1)
                                                        return <div>
                                                                <p className="text-green" style={{'marginTop': '10px'}}>整改要求</p>
                                                                <div className="index-detail-comment">{subItem.requirement}</div>
                                                              </div>
                                                  })(subItem)
                                                }
                                              </div>
                                              <div className="btn-group">
                                                <div className={'btn-circle ' + (subItem.result === 1 ? '' : 'zui-hidden')}><span className="iconfont icon-correct text-green"></span>合格</div>
                                                <div className={'btn-circle ' + (subItem.result !== 1 ? '' : 'zui-hidden')}><span className="iconfont icon-error text-red"></span>不合格</div>
                                                {
                                                  (function(subItem){
                                                      if(!subItem.correctInfo)
                                                      return <div className={'btn-circle btn-border zui-pull-right ' + (subItem.result !== 1 ? '' : 'zui-hidden')} onClick={() => that.showCorWindow(item, index, subItem,subIndex)}>整改详情 ></div>
                                                  })(subItem)
                                                }
                                              </div>
                                              {
                                                  (function(subItem){
                                                      if(subItem.correctInfo)
                                                      return <div className='correct-detail'>
                                                        <p className="text-green">复查详情</p>
                                                        <YYBaseInfo className="details" baseInfoList={correctDetail(subItem)} />
                                                        <YYShowAttachesList attachesList = {subItem.correctInfo.attachesList} />
                                                      </div>
                                                  })(subItem)
                                              }    
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

        <div className={recheaderClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              mode="light" 
              onLeftClick={this.closeCorWindow}
              rightContent={
              <div onClick={this.submitReformWindow}>确定</div>
            }
            >复查情况
          </NavBar>
          <div className='zui-content sys-scroll deviceCheckDetailNoProvider-subWindow'>
            <List className="my-list">
              <List.Item extra={reviewObj.requirement}>整改要求</List.Item>
            </List>
            <List>
              <List.Item
                  extra={reviewObj.reviewerId? reviewObj.reviewerId.name : '请选择'} 
                  onClick={this.chooseReformPersonWindow}
                  arrow="horizontal"
                >复查人</List.Item>
                <DatePicker
                  mode="date"
                  title="选择日期"
                  extra="请选择"
                  value={reviewObj.reviewDate}
                  onChange={
                    (value) => {
                      reviewObj.reviewDate = value;
                      this.setState({reviewObj,});
                    }
                  }
                 >
                  <List.Item arrow="horizontal">复查时间</List.Item>
                </DatePicker>
                <Picker 
                  data={ reviewResultArr } 
                  cols={1}
                  extra="请选择"
                  value={ reviewObj.reviewResult  ? [reviewObj.reviewResult.value] : 1 }
                  onChange={
                    (value) => {                 
                      console.log('Picker value == ', value[0]);
                      reviewObj.reviewResult.value = value[0];
                      reviewResultArr.map(function(item, index){
                        if(item.value == reviewObj.reviewResult.value){
                          reviewObj.reviewResult.label = item.label;
                          return;
                        }
                      });
                      console.log('Picker reviewResult == ', reviewObj.reviewResult);
                      this.setState({reviewObj,});
                    }
                  }
                >
                  <List.Item arrow="horizontal">复查结果</List.Item>
                </Picker>
                <List.Item 
                  extra={
                    <TextareaItem
                      value={reviewObj.content}
                      placeholder="请输入复查情况..."
                      autoHeight
                      onChange={ (val) => this.saveReviewContent(val)}
                    />
                  }
                >复查情况</List.Item>
                <ImagePicker
                  files={reviewObj.attachesList}
                  onChange={(files, type, index) => {
                    this.onFilesChange(files, type, index);
                  }}
                  selectable={true}
                  multiple={true}
                />
              </List>

          </div>
        </div>

      <PsnRef submitPsnRef={ this.submitPsnRef } isShowPsnRef={ isShowPsnRef } />
      </div>
    );
  }
}

DeviceCheckDetailNoProvider.contextTypes = {  
     router:React.PropTypes.object  
} 

export default DeviceCheckDetailNoProvider;
