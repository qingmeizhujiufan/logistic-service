import React from 'react';
import { NavBar, Icon, Accordion, List, Toast, DatePicker, TextareaItem, Picker, ImagePicker } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceCheck.less';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';
import YYPane from 'Comps/yyjzMobileComponents/yyPane';
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

import PsnRef from '../../../pub/refs/component/psnRef';

const queryDetailUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/queryDetail';
const checkitemsUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/checkitems';
const correctionInfoUrl = MODULE_URL.DEVCONT_BASEHOST + "/emElmDevCheck/correct";
const reviewSaveUrl = MODULE_URL.DEVCONT_BASEHOST + "/emElmDevCheck/saveReview";
const correctShowUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/showHistory';
//获取当前时间
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceCheckDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      correctInfoDatail:{},
      isShowCorWindow:false,
      isShowReviewWindow:false,
      data: {},
      checkDetails: [],
      correctName:{},
      isShowPsnRef:false, 
      isShowRecRef:false,
      psnName:'',
      files: [],
      correctReply:{},
      replyImgList: [], 
      value:'',
      dataReportTime:{
        reportTime: now
      },
      itemData:{},
      psnName:'',
      psnId:'',
      reviewVo:{},
      reviewName:{},
      replyCrrImgList:[],
      recData:[],
      attachesList:[],
      recImgList:[],
      review:{}
    };
  }

  //首次渲染之前数据加载
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
          if(backData) {
            backData.examPerson = backData.examId ? backData.examId.name : '';
            var params = {
              billType: 'DC01',
              checkType: backData.checkType.code,
              contId: backData.contId,
              devId: backData.devId, 
            };
            var editTable = backData.editTable;
            var correctTable = backData.correctTable;
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
                    result: 1
                  }
                  for(var j = 0, len = editTable.length; j < len; j++) {
                    if(editTable[j].dictCkId === itemData[i].id) {
                      o.id = editTable[j].id;
                      o.checkBillId = editTable[j].checkBillId;
                      o.examState = backData.examState;
                      o.isCorrect = editTable[j].isCorrect;
                      o.comment = editTable[j].comment;
                      o.result = editTable[j].result;
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
                
                if(itemDetails.length > 0 && correctTable.length > 0){
                  let that = this;
                  itemDetails.forEach(function(first) {
                    if(first.children){
                      first.children.forEach(function(second) {
                        correctTable.forEach(function(third) {
                          if(third.itemId === second.dictCkId) {
                            second.correctInfo = third;
                            //that.setState({correctInfoDatail:third})
                          } 
                        });
                        if(second.result === 0){
                          first.hasRectify = 1;
                        }         
                      });
                    }
                    
                  });
                }

                this.setState({
                  checkDetails: itemDetails
                });

                this.getAttachList(itemDetails, () => {
                  this.setState({
                    checkDetails: itemDetails
                  });
                });
                console.log('itemDetails === ', itemDetails);
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
        console.log('this data == ', this.state.data);
      }
    );
  }

  //获取检查附件
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

  //获取历史记录页整改与复查附件
  getRecAttach = (recData, callback) => {
    recData.forEach(function(items) { 
      items.attachesList = [];
      var params = {
        id: items.id,
        billType: 'REPLY01',
        type: 'REPLY001'
      };
      Files.filesDownLoad(items, params, callback);
      if(items.review != null){
        items.review.attachesList = [];
        var param = {
          id: items.review.id,
          billType: "RECHECK01",
          type: "RECHECK001"
        };
      Files.filesDownLoad(items.review, param, callback);
      }
    }) 
  }

  //打开整改页面
  showCorWindow = (item, subIndex) => {  
     Toast.loading('正在加载...', 0);
     console.log(item)  
     const itemDetail = item.correctInfo;
     const itemName = itemDetail.correctOrg;
     const reviewVo = itemDetail.reviewVo;
     this.setState({
      correctInfoDatail:itemDetail,
      correctName: itemName
     }); 
     let corParams = {
      correctId:itemDetail.id
     }; 
     ajax.getJSON(
      correctionInfoUrl, 
      corParams,
      data => {
        if(data.success || data.backMsg != null) {
          console.log(data); 

           if(itemDetail.state == 0){
              this.setState({isShowCorWindow: true}); 
           } else if(itemDetail.state == 1){
              this.setState({isShowReviewWindow: true}); 
           } else { 
              this.setState({isShowReviewWindow: true});
              this.setState({
                reviewVo:data.backData.reviewVo,
                reviewName:data.backData.reviewVo.reviewerId
              });
              let replyCrrImgList = {
                attachesList: []
              }; 
              //console.log(this.state.correctReply.id)
              if(this.state.reviewVo !=null){
                this.getReplyAttach(this.state.reviewVo.id, replyCrrImgList,() =>{
                    this.setState({
                      replyCrrImgList:replyCrrImgList
                  });
                },'RECHECK01','RECHECK001');
              }  
           };

          this.setState({
            correctReply:data.backData
          })
          let replyImgList = {
            attachesList: []
          }; 
          //console.log(this.state.correctReply.id)
          if(this.state.correctReply !=null){
            this.getReplyAttach(this.state.correctReply.id, replyImgList,() =>{
                this.setState({
                  replyImgList:replyImgList
              });
            },'REPLY01','REPLY001');
          }
          Toast.hide(); 
        }  
      } 
    ); 
  }

  //打开历史整改记录
  openRecWindow = () => {
    this.setState({ isShowRecRef:true });
    let correctReply = this.state.correctReply;
    console.log(correctReply);
    if(correctReply == null){
      return;
    }
    let param = {
      correctId: correctReply.correctId
    };    
    ajax.getJSON(
      correctShowUrl, 
      param,
      data => {
        if(data.success) {
          this.setState({
            recData:data.backData,
            review:data.backData.review
          });
 
          let recData = this.state.recData;
            this.getRecAttach(recData,() =>{
                this.setState({
                  recData:recData
              });
            });

        } 
      } 
    );  
  }

  //人员参照
  openPsnRef = () => {
    console.log(this)
    this.setState({
      isShowPsnRef: true, 
    }); 
  }

  //人员参照回调
  submitPsnRef = (psnInfo,type) => {
    switch(type){
      case 'open': 
        console.log('deviceInfo == ', psnInfo);  
        let psnName = this.state.psnName;
        console.log(psnName)
        this.setState({ 
          psnId:psnInfo.id,
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

  //获取整改或复查的附件
  getReplyAttach = (billId, replyImgList, callback, billType, type) => {
    var params = {
      id: billId,
      billType: billType,
      type: type
    };
    Files.filesDownLoad(replyImgList, params, callback);
  }

  //复查附件上传
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
    } else {
        let attachesList = itemData.attachesList;
        attachesList.splice(index, 1);
        itemData.attachesList = attachesList;
        this.setState({
          itemData,
        })
    }
  }

  //合格点击事件
  doQualified = () => {
    let param = {};
    let data = this.state.data;
    let dataReportTime = this.state.dataReportTime;
    let itemData= this.state.itemData;  

    let reviewerId = {};
    reviewerId.id = this.state.psnId;  
    reviewerId.name = this.state.psnName; 

    param.checkId = data.id;
    param.content = this.state.value;
    param.correctId = this.state.correctInfoDatail.id;
    param.correctRecordId = this.state.correctReply.id;
    param.examResult = data.examState;
    param.examState  = data.examState;
    param.id = null;
    param.reviewDate = new Date(dataReportTime.reportTime).getTime();
    param.reviewState = 0;
    param.reviewUpload = itemData.attachesList.map(function(item, index) {
            return item.gid;
          }).join(',');
    param.reviewerId = reviewerId;
    console.log(param)    
    ajax.postJSON(
      reviewSaveUrl, 
      JSON.stringify(param),
      data => {
        if(data.success) {
          console.log(data);
          this.context.router.goBack();
        } 
      } 
    );  
  }

  //不合格点击事件
  doUnQualified = () => {
    //alert('unpass')
    let param = {};
    let data = this.state.data;
    let dataReportTime = this.state.dataReportTime;
    let itemData= this.state.itemData;  

    let reviewerId = {};
    reviewerId.id = this.state.psnId;  
    reviewerId.name = this.state.psnName; 

    param.checkId = data.id;
    param.content = this.state.value;
    param.correctId = this.state.correctInfoDatail.id;
    param.correctRecordId = this.state.correctReply.id;
    param.examResult = data.examState;
    param.examState  = data.examState;
    param.id = null;
    param.reviewDate = new Date(dataReportTime.reportTime).getTime();
    param.reviewState = 1;
    param.reviewUpload = itemData.attachesList.map(function(item, index) {
            return item.gid;
          }).join(',');
    param.reviewerId = reviewerId;
    console.log(param)    
    ajax.postJSON(
      reviewSaveUrl, 
      JSON.stringify(param),
      data => {
        if(data.success) {
          console.log(data);
          this.context.router.goBack();
        } 
      } 
    );  
  }

  //关闭历史整改记录
  closeRecWindow = () => {
    this.setState({isShowRecRef: false});
  }

  //关闭整改页
  closeCorWindow = () => {
     this.setState({isShowCorWindow: false});  
  }

  //关闭复查页
  closeReviewWindow = () => {
    this.setState({
      isShowReviewWindow: false,
      isShowPsnRef:false
    });  
  }

  // onChange = (files, type, index) => {
  //   console.log(files, type, index);
  //   this.setState({
  //     files,
  //   });
  // }

  //返回
  callback = () => {
    this.context.router.goBack();
  }

  render() {
    let that = this;
    let { 
      data, 
      recData, 
      checkDetails, 
      isShowCorWindow, 
      isShowReviewWindow, 
      value, 
      files, 
      itemData, 
      psnName, 
      psnId, 
      dataReportTime, 
      correctInfoDatail,
      reviewVo,
      reviewName,
      correctName,
      isShowPsnRef,
      isShowRecRef,
      correctReply,
      recImgList,
      replyImgList,
      replyCrrImgList } = this.state;
    let headerClass = `ref-window ${ isShowCorWindow ? 'active' : '' }`;
    let reviewheaderClass = `ref-window ${ isShowReviewWindow ? 'active' : '' }`;
    let recheaderClass = `ref-window ${ isShowRecRef ? 'active' : '' }`; 
    const replyAttachList = <YYShowAttachesList attachesList = {replyImgList.attachesList} />;
    const replyCrryAttachList = <YYShowAttachesList attachesList = {replyCrrImgList.attachesList} />;
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
      value: data.result === 1 ? '合格':'不合格' 
    }, {
      label: '检查状态',
      value: data.examState ==1?'待整改':(data.examState ==2?'待复查':(data.examState==3?'已完成':''))
    }];
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备检查详情</NavBar>
        <div className="zui-content zui-scroll-wrapper">
          <div className="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
               <YYBaseInfo baseInfoList={baseInfoList} />
              </Accordion.Panel>
            </Accordion>
            <YYPane title = {'检查内容'} />
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            {
              checkDetails.map(function(item, index){
                  return  <Accordion.Panel key={index} header={item.checkContent}>
                            {                           
                              (item.children ? item.children : []).map(function(subItem, subIndex){
                                  return  <div key={subIndex} className="content-details index-list">
                                            <div className="wrap-index">
                                              <p className="index-text">
                                                <span className="iconfont icon-project text-green"></span>
                                                <span>{subItem.checkContent}</span>
                                              </p>
                                              <div className="index-detail">
                                                <p className="text-green">检查详情</p>
                                                <div className = "index-detail-comment">{subItem.comment}</div>
                                                <YYShowAttachesList attachesList = {subItem.attachesList} />
                                              </div>
                                              <div className="btn-group">
                                                <div className={'btn-circle ' + (subItem.result === 1 ? '' : 'zui-hidden')}><span className="iconfont icon-correct text-green"></span>合格</div>
                                                <div className={'btn-circle ' + (subItem.result !== 1 ? '' : 'zui-hidden')}><span className="iconfont icon-error text-red"></span>不合格</div>
                                                <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 0 ? '' : 'zui-hidden')}><span className="iconfont icon-rectification text-blue"></span>待整改</div>
                                                <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 1 ? '' : 'zui-hidden')}><span className="iconfont icon-review text-orange"></span>未复查</div>
                                                <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 2 ? '' : 'zui-hidden')}><span className="iconfont icon-rectification text-green"></span>复查通过</div>
                                                <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 3 ? '' : 'zui-hidden')}><span className="iconfont icon-review text-red"></span>复查不通过</div>
                                                <div className={'btn-circle btn-border zui-pull-right ' + (subItem.isCorrect ? '' : 'zui-hidden')} onClick={() => that.showCorWindow(subItem,subIndex)}>整改详情 ></div>
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
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={ this.closeCorWindow }
              rightContent={
                <div onClick={() => that.openRecWindow()}>历史整改记录</div>
              }
            >整改信息</NavBar>
          <div className='zui-content sys-scroll'>  
                <List className="my-list">
                  <List.Item extra={correctInfoDatail.requirement}>整改要求</List.Item>   
                  <List.Item extra={correctName.name}>整改责任人</List.Item> 
                  <List.Item extra={correctInfoDatail.endDate}>整改日期  </List.Item> 
                </List> 
          </div>
        </div>

        <div className={reviewheaderClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={ this.closeReviewWindow }
              rightContent={
                <div onClick={() => that.openRecWindow()}>历史整改记录</div>
              }
            >设备复查</NavBar>
          <div className='zui-content sys-scroll'>  
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
              <List className="my-list">
                <List.Item extra={correctInfoDatail.sevrtLevel ==0?'轻微':(correctInfoDatail.sevrtLevel==1?'一般':'严重')}>问题严重性</List.Item>   
                <List.Item extra={correctInfoDatail.requirement}>整改要求</List.Item>   
                <List.Item extra={correctName.name}>整改人</List.Item>   
                <List.Item extra={correctInfoDatail.endDate}>整改日期</List.Item>       
              </List>
            </Accordion.Panel>
          </Accordion>

          <div className = {correctInfoDatail.state == 0?'zui-hidden':''}> 
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>供方整改反馈</h2>
            </div>
            <List className="my-list"> 
              <List.Item extra={correctReply==null?'':correctReply.content}>整改内容</List.Item> 
              <List.Item extra={correctReply==null?'':Util.FormatDate(correctReply.correctDate,'time')}>整改完成时间</List.Item>
              <List.Item>{replyAttachList}</List.Item>
            </List> 
          </div>
          
          <div className = {correctInfoDatail.state == 2?'':'zui-hidden'}>
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>复查详情</h2>
            </div>
            <List className="my-list">
                <List.Item extra={reviewName.name}>复查人</List.Item> 
                <List.Item extra={reviewVo.reviewDate}>复查日期</List.Item> 
                <List.Item extra={reviewVo.content}>复查内容</List.Item> 
                <List.Item>{replyCrryAttachList}</List.Item>
            </List> 
          </div>

          <div className = {correctInfoDatail.state == 1?'':'zui-hidden'}>
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>复查信息</h2>
            </div>
            <List className="my-list" style={{marginTop:'10px'}}>
                
                <List.Item extra={this.state.psnName} arrow="horizontal" onClick={this.openPsnRef}>复查人</List.Item>
                 <DatePicker
                  mode="datetime"
                  title="选择日期"
                  extra="请选择"
                  value={dataReportTime.reportTime}
                  onChange={
                    (date) => {
                      (date) => { 
                        dataReportTime.reportTime = date;
                        this.setState({
                         dataReportTime:  dataReportTime});
                      }
                    }
                  }
                 >
                   <List.Item arrow="horizontal">复查日期</List.Item>
                 </DatePicker>
          </List>
          <List className="my-list" style={{marginTop:'10px'}}>
           <List.Item >记录详情
               <TextareaItem  
                  autoHeight
                  labelNumber={5}
                  placeholder='请输入复查内容'  
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

           <div style={{width:'100%',height:"40px"}} className = {correctInfoDatail.state == 1?'':'zui-hidden'}>
            <div className="footer-btn-group" >
              <div  className="left-btn" onClick = {this.doUnQualified}>不合格</div> 
              <div  className="right-btn" icon={<Icon type="check" />} onClick = {this.doQualified}>合格</div>
            </div>
           </div>

          </div>
        </div>

        <div className={recheaderClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={this.closeRecWindow} 
              >历史整改记录
          </NavBar>
          <div className='zui-content sys-scroll'>
          { 
            recData.map(function(item, index){ 
              return <Accordion key={index} defaultActiveKey="0" className="my-accordion" onChange={that.onChange}>
                      <Accordion.Panel header="供应商整改信息">
                        <List className="my-list">
                          <List.Item extra={item.content}>整改内容</List.Item>
                          <List.Item>
                            <YYShowAttachesList attachesList = {item.attachesList} />
                          </List.Item> 
                          <List.Item extra={item.correctDate}>整改完成日期</List.Item>
                          {item.review ==null?'':<List.Item extra={item.review.content}>复查内容</List.Item> }                        
                          {item.review ==null?'':<List.Item>
                            <YYShowAttachesList attachesList = {item.review.attachesList} />
                          </List.Item>}  
                        </List>
                      </Accordion.Panel>
                     </Accordion>
            })
          }
          </div>
        </div>

      <PsnRef submitPsnRef={ this.submitPsnRef } isShowPsnRef={ isShowPsnRef } />
      </div>
    );
  }
}

DeviceCheckDetail.contextTypes = {  
     router:React.PropTypes.object  
} 

export default DeviceCheckDetail;
