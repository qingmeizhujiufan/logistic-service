import React from 'react';
import { NavBar, Icon, Accordion, List, Button, DatePicker, TextareaItem, ImagePicker, Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import '../deviceSupplierDetails.less';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const queryDetailUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/queryDetail';
const checkitemsUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/checkitems';
const correctionSaveUrl = MODULE_URL.DEVCONT_BASEHOST + "/emElmDevCheck/saveCorrect";
const correctionInfoUrl = MODULE_URL.DEVCONT_BASEHOST + "/emElmDevCheck/correct";
const correctShowUrl = MODULE_URL.DEVCONT_BASEHOST + '/emElmDevCheck/showHistory';

class DeviceSupplierDetails extends React.Component{ 
 
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      dataTime:{
        reportTime:now
      },
      checkDetails: [],
      isShowDeviceRef: false,
      isShowReplyRef : false,
      isShowRecRef: false,
      files: [],
      multiple: false,
      correctInfoDatail:{},
      attachesList:[], 
      correctName:{},
      itemData:{},
      value:'',
      correctReply:{},
      replyImgList: [],
      reviewVo:{},
      reviewName:{},
      replyCrrImgList:[],
      recImgList:[],
      recData:[],
      review:{}
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
          if(backData) {
            backData.examPerson = backData.examId ? backData.examId.name : '';
            var params = {
              billType: 'DC01',
              checkType: backData.checkType.code,
              contId: backData.contId,
              devId: backData.devId
            };
            var editTable = backData.editTable;
            var correctTable = backData.correctTable;
            //获取所有不合格项
      			var unqualified = [];
      			editTable.forEach(function(item) {
      				if(item.result == 0) {
      					unqualified.push(item);
      				}
      			});  
            //查询检查内容
            // Util.loadingIn('正在获取检查内容...');
            ajax.getJSON(
              checkitemsUrl,
              params, 
              itemData => {
              var itemData = itemData.backData; 
              if(itemData && itemData.length > 0) {
					//获取第一层
					var itemDetails = [];
					itemData.forEach(function(item) {
						if(!item.pid) {
							itemDetails.push(item);
						}
					}); 
					//将第二层添加到对应的第一层里

					itemDetails.forEach(function(par) {
						var child = [];
						itemData.forEach(function(item) {
							if(par.id == item.pid) {
								child.push(item);
							}
						});
						par.children = child;
					});
					itemDetails.forEach(function(par) {
						par.children.forEach(function(sub) {
							unqualified.forEach(function(third) {
								if(sub.id == third.dictCkId) {
									sub.id = third.id;
									sub.checkBillId = third.checkBillId;
									sub.examState = backData.examState;
									sub.isCorrect = third.isCorrect;
									sub.comment = third.comment;
									sub.result = third.result;
								}
							});
						});
					});
					itemDetails.forEach(function(par) {
						par.children.forEach(function(sub) {
							correctTable.forEach(function(third) {
								if(sub.key == third.itemId) {
									sub.correctInfo = third;
								}
							});
						});
					});

					//只保留不合格项合格项
					var _checkItems = [];
					itemDetails.forEach(function(item) {

						var child = [];
						item.children.forEach(function(sub) {
							if(sub.result == 0) {
								//viewModel.isHiddenFooterBtn(false);
								child.push(sub);
							}

						});
						item.children = child;
						if(item.children.length > 0) {
							_checkItems.push(item);
						} 
					}); 

                this.setState({
                  checkDetails: _checkItems
                });

                this.getAttachList(itemDetails, () => {
                  this.setState({
                    checkDetails: _checkItems
                  });
                });
                console.log('itemDetails === ', itemDetails);
                }  
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
  // 打开整改详情 
  openImpWindow = (item, subIndex) =>{   
     this.setState({isShowDeviceRef: true}); 
     const itemDetail = item.correctInfo;
     const itemName = itemDetail.correctOrg;
     const reviewVo = itemDetail.reviewVo;
     this.setState({
      correctInfoDatail:itemDetail,
      correctName: itemName, 
     });
     console.log(itemDetail) 
     let corParams = {
      correctId:itemDetail.id
     };
     ajax.getJSON(
      correctionInfoUrl, 
      corParams,
      data => {
        if(data.success || data.backMsg != null) { 
          if(itemDetail.state == 2 ){
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
          }
          this.setState({
            correctReply:data.backData, 
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
        }  
      } 
    ); 
  }
  // 历史整改记录
  openRecWindow = () => {
    this.setState({ isShowRecRef:true });
    let correctReply = this.state.correctReply;
    console.log(correctReply);
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
 
  //附件上传
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
    }else {
        let attachesList = itemData.attachesList;
        attachesList.splice(index, 1);
        itemData.attachesList = attachesList;
        this.setState({
          itemData,
        })
    }
  }
// 整改回复
  openReplyWindow = () =>{
    this.setState({isShowReplyRef : true}, ()=>{
      console.log('openImpWindow isShowReplyRef  == ', this.state.isShowReplyRef );
    });  
  }
// 关闭整改详情
  closeRefWindow =() =>{
    this.setState({isShowDeviceRef: false}); 
  }
// 关闭整改回复
  closeReplyWindow =() =>{ 
    this.setState({isShowReplyRef: false});
  }
// 关闭历史整改记录
  closeRecWindow =() =>{
    this.setState({isShowRecRef: false});
  }

  //获取附件列表
  getAttachList = (itemDetails, callback) =>{ 
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
// 获取历史整改记录的附件
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

  //获取整改或复查的附件
  getReplyAttach = (billId, replyImgList, callback, billType, type) =>{
    var params = {
      id: billId,
      billType: billType,
      type: type
    };
    Files.filesDownLoad(replyImgList, params, callback);
  }


  //提交整改信息
  corrOk = () => {
    let data= this.state.data; 
    let itemData= this.state.itemData;  
    console.log(itemData)
    let dataTime= this.state.dataTime; 
    const correctInfoDatail = this.state.correctInfoDatail;  
    const correctParams = {};
    if(this.state.value == null || this.state.value == '') {
      Toast.fail("请输入整改内容");
      return;
    }
    if(itemData.attachesList==null || itemData.attachesList == '') {
      Toast.fail("请上传整改附件");
      return;
    }
    correctParams.correctId = correctInfoDatail.id;
    correctParams.checkId = this.props.params.id; 
    correctParams.correctDate = new Date(dataTime.reportTime).getTime();
    correctParams.content = this.state.value;  
    correctParams.attaches = itemData.attachesList.map(function(item, index) {
            return item.gid;
          }).join(',');

    ajax.postJSON(
      correctionSaveUrl, 
      JSON.stringify(correctParams),
      data => {
        if(data.success) {
          console.log(data);
          this.context.router.goBack();
        } 
      } 
    );  
  }
// 返回
  callback = () =>{
    this.context.router.goBack();
  }
// 监听折叠面板状态
  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }
 
  render() { 
    let data = this.state.data; 
    let recData = this.state.recData; 
    console.log(recData)
    let review = this.state.review; 
    let value = this.state.value; 
    let dataTime = this.state.dataTime;
    let checkDetails = this.state.checkDetails || [];
    const { files } = this.state;
    let isShowDeviceRef = this.state.isShowDeviceRef;
    let isShowReplyRef = this.state.isShowReplyRef;
    let isShowRecRef = this.state.isShowRecRef;
    let headerClass = `ref-window ${ isShowDeviceRef ? 'active' : '' }`; 
    let replyheaderClass = `ref-window ${ isShowReplyRef ? 'active' : '' }`;
    let recheaderClass = `ref-window ${ isShowRecRef ? 'active' : '' }`; 
    let that = this;
    let correctInfoDatail = this.state.correctInfoDatail;   
    let reviewVo = this.state.reviewVo; 
    let reviewName = this.state.reviewName; 
    let correctName = this.state.correctName;
    let correctReply = this.state.correctReply;  
    let replyImgList = this.state.replyImgList || {}; replyCrrImgList 
    let replyCrrImgList = this.state.replyCrrImgList || {};
    let recImgList = this.state.recImgList || {};
    const replyAttachList = <YYShowAttachesList attachesList = {replyImgList.attachesList} />;
    const replyCrryAttachList = <YYShowAttachesList attachesList = {replyCrrImgList.attachesList} />;
   
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备整改单</NavBar>
        <div className={isShowDeviceRef || isShowReplyRef== true?'bdscroll zui-content':'zui-content'}>
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
              <List className="my-list">
                <List.Item thumb={<span className="icon-device icon-device-checkType"></span>} extra={data.examId ? data.examId.name : ''}>检查人</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-inDate"></span>} extra={data.examTime}>检查时间</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-equipmentNO"></span>} extra={data.projectId ? data.projectId.name :''}>项目名称</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-equipment"></span>} extra={data.contractName}>合同名称</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-contract"></span>} extra={data.mgNo}>设备管理编号</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-project"></span>} extra={data.devName ? data.devName+'('+data.devModel+')' : ''}>设备名称</List.Item>
            		<List.Item thumb={<span className="icon-device icon-device-checkType"></span>} extra={data.checkType ? data.checkType.name : ''}>检查类别</List.Item> 
              </List>
            </Accordion.Panel>
          </Accordion>
          <div className='zui-pane'>
            <h2 className='zui-pane-title'>检查内容</h2>
          </div>
           
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
                                      <div className="index-detail-comment">{subItem.comment}</div>
                                      <YYShowAttachesList attachesList = {subItem.attachesList} />
                                    </div>
                                    <div className="btn-group">
                                      <div className={'btn-circle ' + (subItem.result === 1 ? '' : 'zui-hidden')} data-bind="visible: result == 1"><span className="iconfont icon-correct text-green"></span>合格</div>
                                      <div className={'btn-circle ' + (subItem.result !== 1 ? '' : 'zui-hidden')}><span className="iconfont icon-error text-red"></span>不合格</div>
                                      <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 0 ? '' : 'zui-hidden')}><span className="iconfont icon-rectification text-blue"></span>待整改</div>
                                      <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 1 ? '' : 'zui-hidden')}><span className="iconfont icon-review text-orange"></span>未复查</div>
                                      <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 2 ? '' : 'zui-hidden')}><span className="iconfont icon-rectification text-green"></span>复查通过</div>
                                      <div className={'btn-circle ' + (subItem.correctInfo && subItem.correctInfo.state === 3 ? '' : 'zui-hidden')}><span className="iconfont icon-review text-red"></span>复查不通过</div>
                                      <div className={'btn-circle btn-border zui-pull-right ' + (subItem.isCorrect ? '' : 'zui-hidden')} onClick={() => that.openImpWindow(subItem,subIndex)}>整改详情</div>
                                    </div>
                                  </div>
                                </div>
                    },this)
                  }
                </Accordion.Panel>
	            })
	          }
	          </Accordion> 
    	  </div>

        <div className={headerClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={this.closeRefWindow  }
              rightContent={
                <div onClick={() => that.openRecWindow()}>历史整改记录</div>
              }
              >整改详情
          </NavBar> 
          <div className='zui-content sys-scroll'> 
                <List className="my-list">
                  <List.Item extra={correctInfoDatail.sevrtLevel ==0?'轻微':(correctInfoDatail.sevrtLevel==1?'一般':'严重')}>问题严重分类</List.Item>
                  <List.Item extra={correctInfoDatail.requirement}>整改要求</List.Item>
                  <List.Item extra={correctName.name}>整改人</List.Item>
                  <List.Item extra={correctInfoDatail.endDate}>限期整改日期</List.Item> 
                </List> 
            

          <div className = {correctInfoDatail.state == 0?'zui-hidden':''}> 
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>供方整改反馈</h2>
            </div>
            <List className="my-list">
                <List.Item extra={correctReply==null?'':correctReply.correctDate}>整改内容</List.Item> 
                <List.Item>{correctReply==null?'':correctReply.content}</List.Item>
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

          <div style={{width:'100%',height:'40px'}} className = {correctInfoDatail.state != 0?'zui-hidden':''}>
            <div className="footer-btn-group" > 
              <div className="btn" onClick={this.openReplyWindow}>整改回复</div>
            </div>
          </div>  

          </div>
        </div>

        <div className={replyheaderClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={this.closeReplyWindow}
              rightContent={
                <div onClick={ () => {
                  this.corrOk();
                }}>提交</div>
              }
              >整改回复 
          </NavBar> 
          <div className='zui-content sys-scroll'>   
            <List className="my-list" style={{marginTop:'10px'}}>  
                 <DatePicker
                  mode="datetime"
                  title="选择日期"
                  extra="请选择"
                  value={dataTime.reportTime}
                  onChange={
                    (date) => {
                      dataTime.reportTime = date;
                      this.setState({ dataTime:  dataTime});
                    }
                  }
                 >
                   <List.Item arrow="horizontal">整改日期</List.Item>
                 </DatePicker>
            </List>
            <List className="my-list" style={{marginTop:'10px'}}>
             <List.Item >整改内容
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
             <ImagePicker
              files={files}
              onChange={(files, type, index) => {
                this.onFilesChange(files, type, index);
              }}
            />  
            </List> 
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

      </div>
    );
  }
};

DeviceSupplierDetails.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceSupplierDetails;
