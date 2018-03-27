import React from 'react';
import { NavBar, Icon, Button , Accordion, List, Modal, Toast, DatePicker, TextareaItem, InputItem, ImagePicker } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import '../deviceApproachNotice.less';

/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

/* 引入参照 */ 
import DevBrandRef from '../../../pub/refs/component/devBrandRef';


const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/sdetail";
//根据设备ID查询设备详细信息
const devdtlUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/info/devdtl";
const depUrl = MODULE_URL.DEVCONT_BASEHOST + "/supplier/archive/ref";
const depTypeUrl = MODULE_URL.DEVCONT_BASEHOST + "/supplier/category/refTree?pageNumber=1&pageSize=20";
const commitUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/scommit";
const deleteUrl = MODULE_URL.ATTACHURL + "/del"; //图片删除

const billType = 'DEN01';
const Item = List.Item;
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceProviderApproachNoticeDetail extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      data: { 
        reportTime: now
      },
      notice: null,
      deviceInfo: {},
      billCode: null,
      billId: null,
      contractName: null,
      projectName: null,
      supplierName: null,
      projectAddr: null,
      notice: null,
      contactName: null,
      contactPhone: null,
      spotId: null,
      devList: [],
      devItem: {},
      shouldShowPage: false,
      makeFile: {
        attaches: [],
        attachesList: []
      },
      productFile: {
        attaches: [],
        attachesList: []
      },
      checkFile: {
        attaches: [],
        attachesList: []
      },
      recordFile: {
        attaches: [],
        attachesList: []
      },
      instructionFile: {
        attaches: [],
        attachesList: []
      },
      isShowBrandRef: false, 
      psnName:'',
      psnNameId:'', 
      itemData:{},
      makeFiles:[ ],
      productFiles:[ ],
      checkFiles:[ ],
      recordFiles:[ ],
      instructionFiles:[ ],
      makeFileType:[],
      files:[]
    };
  } 
    
  componentWillMount = () => {
    const that = this;
    ajax.getJSON(
      findByIdUrl + '/' + this.props.params.id + '/0',
      null,
      data => {
        var backData = data.backData;
        this.setState({
          billCode: backData.notice.billCode,
          contractName: backData.notice.contractName,
          projectName: backData.notice.projectName,
          projectAddr: backData.notice.projectAddr,
          supplierName: backData.notice.supplierName,
          contactName: backData.notice.contactName,
          contactPhone: backData.notice.contactPhone,
          billState: backData.notice.billState,
          spotId: backData.notice.spotId,
          devList: backData.notice.devList,
          billId: backData.notice.id,
          notice: backData.notice,
          devItem: backData.notice.devItem 
        });  
      }
    );

    let makeFile = {
          attaches: [],
          attachesList: []
        },
        productFile = {
          attaches: [],
          attachesList: []
        },
        checkFile = {
          attaches: [],
          attachesList: []
        },
        recordFile = {
          attaches: [],
          attachesList : []
        },
        instructionFile = {
          attaches: [],
          attachesList : []
        };  
        this.getAttachList(this.props.params.id, 
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
  } 
 // 供应商进场备货添加设备/查看详情（根据billState确定）按钮点击事件
  detailDevice = () => { 
    Toast.loading('Loading...', 0);
    let that = this;
    const {billState} = this.state;
    if(billState !== 46 && billState !== 47){
      let makeFile = {
          attaches: [],
          attachesList: []
        },
        productFile = {
          attaches: [],
          attachesList: []
        },
        checkFile = {
          attaches: [],
          attachesList: []
        },
        recordFile = {
          attaches: [],
          attachesList : []
        },
        instructionFile = {
          attaches: [],
          attachesList : []
        };
        this.setState({
          makeFile:makeFile,
          productFile:productFile,
          checkFile:checkFile,
          recordFile:recordFile,
          instructionFile:instructionFile
        });  
    }
    this.setState({
      shouldShowPage: true,
      isShowBrandRef: false
    });
    const {devItem,spotId,billId} = this.state;
    console.log(devItem)
      if(devItem !== null) {  
        ajax.getJSON(findByIdUrl + '/' + this.props.params.id + '/1', null, function(data) {
          Toast.hide();
          var backDataDev = data.backData.devItem;   
          that.setState({
            deviceInfo: backDataDev,
            psnName:backDataDev.makerName
          });
        }); 
          
        } else {
          const {notice,deviceInfo} = this.state;
          var info = {};
          info.sdevName = notice.devList[0].devName;
          info.sdevModel = notice.devList[0].devModel;
          info.equityComp = notice.supplierName;
          info.equityCompId = notice.supplierId;
          info.maker = notice.devList[0].maker;
          info.makerName = notice.devList[0].makerName;
          if(authToken.getSup() && authToken.getSupId()) {
            Toast.hide();
            info.supplierId = authToken.getSupId();
            info.supplierName = authToken.getSupName();
          } else {
            Toast.fail('供应商信息缺失，请稍后再试！', 1);
          }
          this.setState({
            deviceInfo: info,
            psnName:info.makerName
          }); 
      }

      let imgAttachesList = [this.state.makeFile.attachesList,
                             this.state.productFile.attachesList,
                             this.state.checkFile.attachesList,
                             this.state.recordFile.attachesList,
                             this.state.instructionFile.attachesList];
      for(var z=0; z<imgAttachesList.length; z++){
        if(z==0){
          let makeFilesImgAttaches = imgAttachesList[z];
          for(var i=0; i<makeFilesImgAttaches.length; i++){
            let makeFiles = this.state.makeFiles;
            let makeFilesImglist = {};
            makeFilesImglist = {
              id:makeFilesImgAttaches[i].gid,
              url:makeFilesImgAttaches[i].thumbnail
            };
            makeFiles.push(makeFilesImglist) 
          }
        } 
        else if(z==1){
          let productFilesImgAttaches = imgAttachesList[z];
          for(var i=0; i<productFilesImgAttaches.length; i++){
            let productFiles = this.state.productFiles;
            let productFilesImglist = {};
            productFilesImglist = {
              id:productFilesImgAttaches[i].gid,
              url:productFilesImgAttaches[i].thumbnail
            };
            productFiles.push(productFilesImglist) 
          }
        } else if(z==2){
          let checkFilesImgAttaches = imgAttachesList[z];
          for(var i=0; i<checkFilesImgAttaches.length; i++){
            let checkFiles = this.state.checkFiles;
            let checkFilesImglist = {};
            checkFilesImglist = {
              id:checkFilesImgAttaches[i].gid,
              url:checkFilesImgAttaches[i].thumbnail
            };
            checkFiles.push(checkFilesImglist) 
          }
        } else if(z==3){
          let recordFilesImgAttaches = imgAttachesList[z];
          for(var i=0; i<recordFilesImgAttaches.length; i++){
            let recordFiles = this.state.recordFiles;
            let recordFilesImglist = {};
            recordFilesImglist = {
              id:recordFilesImgAttaches[i].gid,
              url:recordFilesImgAttaches[i].thumbnail
            };
            recordFiles.push(recordFilesImglist) 
          }
        } else if(z==4){
          let instructionFilesImgAttaches = imgAttachesList[z];
          for(var i=0; i<instructionFilesImgAttaches.length; i++){
            let instructionFiles = this.state.instructionFiles;
            let instructionFilesImglist = {};
            instructionFilesImglist = {
              id:instructionFilesImgAttaches[i].gid,
              url:instructionFilesImgAttaches[i].thumbnail
            };
            instructionFiles.push(instructionFilesImglist) 
          }
        }
      }   
  } 
// 设备附件上传
  onImgChange = (files, type, index, filetype) => {
    console.log(files, type, index);
    let {makeFiles, productFiles, checkFiles, recordFiles, instructionFiles} = this.state;
    if(filetype == 11){ 
      if(type=='remove'){
        let makeImg = files;
        makeImg.splice(index, 0);
        files = makeImg;
        this.setState({
          makeFiles:files,
        })
      } else {
        this.setState({
          makeFiles:files, 
        })
      }
    } else if(filetype == 12){
      if(type=='remove'){
        let productImg = files;
        productImg.splice(index, 0);
        files = productImg;
        this.setState({
          productFiles:files, 
        })
      } else {
        this.setState({
          productFiles:files, 
        })
      }
    } else if(filetype == 13){
      if(type=='remove'){
        let checkImg = files;
        checkImg.splice(index, 0);
        files = checkImg;
        this.setState({
          checkFiles:files, 
        })
      } else {
        this.setState({
          checkFiles:files, 
        })
      }
    } else if(filetype == 14){
      if(type=='remove'){
        let recordImg = files;
        recordImg.splice(index, 0);
        files = recordImg;
        this.setState({
          recordFiles:files, 
        })
      } else {
        this.setState({
          recordFiles:files, 
        })
      }
    } else if(filetype == 15){
      if(type=='remove'){
        let instructionImg = files;
        instructionImg.splice(index, 0);
        files = instructionImg;
        this.setState({
          instructionFiles:files, 
        })
      } else {
        this.setState({
          instructionFiles:files, 
        })
      }
    }
  } 
  
  //获取附件列表
  getAttachList = (id, fileArray, callback) => {
    console.log("id==",id);
    for (let i = 11; i <= 15; i++) {
        let param = {
          id: id,
          billType: billType,
          type: i,
        };
        if(i === 11){
          Files.filesDownLoad(fileArray[0], param, callback); 
        }else if(i === 12){
          Files.filesDownLoad(fileArray[1], param, callback);
        }else if(i === 13){
          Files.filesDownLoad(fileArray[2], param, callback);
        }else if(i === 14){
          Files.filesDownLoad(fileArray[3], param, callback);
        }else if(i === 15){
          Files.filesDownLoad(fileArray[4], param, callback);
        }
    }; 
  } 

  //附件上传
  onFilesChange = (files, type, index, typefile) => { 
      const itemData = this.state.itemData;
      if(typefile == 11) {
        itemData.attachesList = this.state.makeFile.attachesList;
      } else if(typefile == 12) {
        itemData.attachesList = this.state.productFile.attachesList;
      } else if(typefile == 13) {
        itemData.attachesList = this.state.checkFile.attachesList;
      } else if(typefile == 14) {
        itemData.attachesList = this.state.recordFile.attachesList;
      } else {
        itemData.attachesList = this.state.instructionFile.attachesList;
      } 
      if(type === 'add'){
      let source = {};
      source.sourceId = this.state.billId;
      source.sourceType = type; 
      Files.multiFilesUpLoad( 
        itemData,
        files,
        "DEN01", 
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

  //保存
  deviceConfirm = () => {
    const {deviceInfo,makeFile,productFile,billId,data,psnName,psnNameId} = this.state;
     console.log(deviceInfo);
     deviceInfo.prodTime = new Date(data.reportTime).getTime();
     deviceInfo.makerName = psnName;
     deviceInfo.maker = psnNameId;
     deviceInfo.enntyId = billId;
      
    if(!deviceInfo.mainParam) {
      Toast.info('请输入主要参数',1);
      return;
    }
    if(!deviceInfo.power) {
      Toast.info('请输入功率',1);
      return;
    }
    if(!deviceInfo.prodTime) {
      Toast.info('请选择出厂日期',1);
      return;
    }
    if(!deviceInfo.makerName) {
      Toast.info('请选择品牌',1);
      return;
    }
    if(!deviceInfo.factoryNo) {
      Toast.info('请输入出厂编号',1);
      return;
    }
    if(!deviceInfo.equityType) {
      Toast.info('请输入产权性质',1);
      return;
    }
    if(!deviceInfo.filNo) {
      Toast.info('请输入备案编号',1);
      return;
    }
    if(makeFile.attachesList.length == 0) {
      Toast.info('请上传制造许可证附件',1);
      return;
    }
    if(productFile.attachesList.length == 0) {
      Toast.info('请上传产品合格证附件',1);
      return;
    } 
    const alert = Modal.alert;
    const content = alert('保存的同时将推送设备信息给项目部。', '是否确认保存？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => {
        this.setState({
          deviceInfo: deviceInfo
        });
         ajax.postJSON(commitUrl, JSON.stringify(deviceInfo), function(data) {
          if(data.success) {
            Toast.info("保存成功",1);
            window.location.href = '#/deviceProvider/deviceApproachNotice';
          } 
        });
       } 
      },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      content.close();
    }, 50000);
  } 

 //打开品牌参照
  openDevbrandRef = () => { 
    console.log(this.state.deviceInfo.makerName);
    if(this.state.deviceInfo.makerName ==""||this.state.deviceInfo.makerName ==null){
      this.setState({
        isShowBrandRef: true, 
      }); 
    } else {
      return
    }
  } 

//回调品牌信息
  submitBrandRef = (brandInfo,type) => {  
    switch(type){
      case 'open':
        this.setState({
          psnName:brandInfo.shortname,
          psnNameId:brandInfo.id,
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
  // 关闭设备详情页面
  closeWindow = () => {
    this.setState({
      shouldShowPage: false, 
    });
  } 
 // 返回
  callback = () => {
    this.context.router.goBack();
  } 
 
  render() {
    const {files,makeFileType,makeFiles,productFiles,checkFiles,recordFiles,instructionFiles,psnName,data,billCode,contractName,projectName,projectAddr,supplierName,contactName,contactPhone,devList,billState,makeFile,productFile,checkFile,recordFile,instructionFile,shouldShowPage,deviceInfo,isShowBrandRef} = this.state;
    const that = this;                                  
    const DetailDevice = (billState === 46 || billState === 47) ? <span className='show-detail-btn' onClick = {this.detailDevice} >查看详情</span> : <span className='show-detail-btn' onClick = {this.detailDevice}  >添加设备</span>;
    const deviceWindow = `ref-window ${ shouldShowPage ===true ? 'active' : '' }`;  
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >进场备货</NavBar>
        <div>
          <div className='zui-content'>
            <Accordion defaultActiveKey="1" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <Item extra={billCode}>通知单号</Item>
                  <Item extra={contractName}>合同名称</Item>
                  <Item extra={projectName}>项目名称</Item>
                  <Item extra={projectAddr}>项目地址</Item>
                  <Item extra={supplierName}>供方名称</Item>
                  <Item extra={contactName}>联系人员</Item>
                  <Item extra={contactPhone}>联系电话</Item>
                </List>
              </Accordion.Panel>
            </Accordion>
          </div>
          <div className='zui-pane'>
            <h2 className='zui-pane-title'>进场设备详情</h2>
          </div>
          {
            (devList&&devList.length>0 ? devList : []).map(function(item, index){
                return  <div key={index} className='device-list'>
                            <div className='device-detail'>
                              <div className='header'>
                                <span>{item.devName}</span>
                                <span className='device-dec'>{item.devModel}</span>
                                <span className='approach-time' style = {{color: '#ff9090'}}>
                                  <span>进场时间：</span>
                                  <span>{item.enterDate}</span>
                                </span>
                                {DetailDevice}
                              </div>
                            </div>
                            <div className="device-detail" style = {{marginTop: '-9px'}}>
                              <div className="text-border">来源</div>
                              <div className="device-detail-text">{contractName}</div>
                              <div className="text-border">进场要求</div>
                              <div className="device-detail-text">{item.requirement}</div>
                              <div className="text-border hair-line-top">备注</div>
                              <div className="device-detail-text">{item.memo}</div>
                            </div>
                        </div>
            })
          } 
        </div>
        <div className = {deviceWindow}>
          <NavBar
            icon={<Icon type="cross" />}
            leftContent="关闭" 
            mode="light" 
            onLeftClick={this.closeWindow}
            rightContent={
              <div style = {{display: (billState === 46 || billState === 47) ? 'none' : 'block' }} onClick={ () => {
                this.deviceConfirm();
                return ;
              }}>保存</div>
            }
          >设备详情</NavBar>
          {
            (billState == 46 || billState == 47) ? (
              <div className = "zui-sub-content">
                <List className="my-list">
                  <Item extra={deviceInfo.sdevName}>设备名称</Item>
                  <Item extra={deviceInfo.sdevModel}>规格型号</Item>
                  <Item extra={deviceInfo.mainParam}>主要参数</Item>
                  <Item extra={deviceInfo.power}>功率</Item>
                  <Item extra={deviceInfo.prodTime}>出厂日期</Item>
                  <Item extra={deviceInfo.makerName}>品牌</Item>
                  <Item extra={deviceInfo.equityComp}>产权单位</Item>
                  <Item extra={deviceInfo.factoryNo}>出厂编号</Item>
                  <Item extra={deviceInfo.equityType}>产权性质</Item>
                  <Item extra={deviceInfo.filNo}>备案编号</Item>
                </List>
                <div className='zui-pane'>
                  <h2 className='zui-pane-title'>设备附件</h2>
                </div>

                <List className="my-list">
                  <Item>
                    <p style = {{margin:'0',padding:'10px'}}>制造许可证</p>
                    <YYShowAttachesList attachesList = {makeFile.attachesList} />
                  </Item>
                  <Item>
                    <p style = {{margin:'0',padding:'10px'}}>产品合格证</p>
                    <YYShowAttachesList attachesList = {productFile.attachesList} />
                  </Item>
                  <Item>
                    <p style = {{margin:'0',padding:'10px'}}>制造监督检验证明</p>
                    <YYShowAttachesList attachesList = {checkFile.attachesList} />
                  </Item>
                  <Item>
                    <p style = {{margin:'0',padding:'10px'}}>备案证明</p>
                    <YYShowAttachesList attachesList = {recordFile.attachesList} />
                  </Item>
                  <Item>
                    <p style = {{margin:'0',padding:'10px'}}>使用说明书</p>
                    <YYShowAttachesList attachesList = {instructionFile.attachesList} />
                  </Item>
                </List> 
              </div>
              ) : (
                <div className = "zui-sub-content">
                  <List className="my-list">
                    <Item extra={deviceInfo.sdevName ==null?'':deviceInfo.sdevName}>设备名称</Item>
                    <Item extra={deviceInfo.sdevModel}>设备型号</Item>
                    <Item extra={
                      <TextareaItem 
                        style={{backgroundColor: '#f0f0f0',textAlign: 'right'}}
                        autoHeight 
                        labelNumber={5} 
                        value = {deviceInfo.mainParam}  
                        onChange={
                            (value) => {
                              deviceInfo.mainParam = value;
                              this.setState({ deviceInfo:  deviceInfo});
                            }
                          }
                      >
                      </TextareaItem>
                    }>主要参数</Item>
                    <Item extra={
                      <InputItem 
                        placeholder = '请输入功率' 
                        value={deviceInfo.power} 
                        onChange={
                            (value) => {
                              deviceInfo.power = value;
                              this.setState({ deviceInfo:  deviceInfo});
                            }
                          }>
                      </InputItem>
                    }>功率</Item>
                     <DatePicker
                        mode="date"
                        title="选择日期"
                        extra="请选择"
                        value={data.reportTime}
                        onChange={
                          (date) => { 
                            data.reportTime = date;
                            this.setState({ data:  data});
                          }
                        }
                       >
                      <Item arrow="horizontal">出厂日期</Item>
                    </DatePicker>
                    <Item arrow="horizontal" onClick = {this.openDevbrandRef} extra={psnName ? psnName : '请选择'}>品牌</Item>
                    <Item extra={
                      <TextareaItem 
                        style={{backgroundColor: '#f0f0f0',textAlign: 'right'}}
                        autoHeight 
                        labelNumber={5} 
                        value = {deviceInfo.equityComp}
                        onChange={
                          (value)=> {
                            deviceInfo.equityComp = value;
                            this.setState({ deviceInfo:  deviceInfo});
                          }
                        }>
                      </TextareaItem>
                    }>产权单位
                    </Item>
                    <Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入出厂编号' 
                          value={deviceInfo.factoryNo} 
                          onChange={
                            (value)=> {
                              deviceInfo.factoryNo = value;
                              this.setState({ deviceInfo:  deviceInfo});
                            }
                          }>
                        </InputItem>}>出厂编号
                    </Item>
                    <Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入产权性质' 
                          value={deviceInfo.equityType} 
                          onChange={
                            (value)=> {
                              deviceInfo.equityType = value;
                              this.setState({ deviceInfo:  deviceInfo});
                            }
                          }>
                        </InputItem>}>产权性质
                    </Item>
                    <Item 
                      extra={
                        <InputItem 
                          placeholder = '请输入备案编号' 
                          value={deviceInfo.filNo} 
                          onChange={
                            (value)=> {
                              deviceInfo.filNo = value;
                              this.setState({ deviceInfo:  deviceInfo});
                            }
                          }>
                        </InputItem>}>备案编号
                    </Item>
                  </List>
                  <div className='zui-pane'>
                    <h2 className='zui-pane-title'>设备附件</h2>
                  </div>
                  <List className="my-list">
                    <Item>
                      <p style = {{margin:'0',padding:'10px'}}>制造许可证</p> 
                         <ImagePicker
                            files={makeFiles}
                            onChange={(files, type, index) => {
                              this.onImgChange(files, type, index,11);
                            }}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 5}
                            multiple={this.state.multiple} 
                        /> 
                    </Item>
                    <Item>
                      <p style = {{margin:'0',padding:'10px'}}>产品合格证</p>
                        <ImagePicker
                            files={productFiles}
                            onChange={(files, type, index) => {
                              this.onImgChange(files, type, index,12);
                            }}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 5}
                            multiple={this.state.multiple} 
                        />
                    </Item>
                    <Item>
                      <p style = {{margin:'0',padding:'10px'}}>制造监督检验证明</p>
                      <ImagePicker
                            files={checkFiles}
                            onChange={(files, type, index) => {
                              this.onImgChange(files, type, index,13);
                            }}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 5}
                            multiple={this.state.multiple} 
                      />
                    </Item>
                    <Item>
                      <p style = {{margin:'0',padding:'10px'}}>备案证明</p>
                      <ImagePicker
                            files={recordFiles}
                            onChange={(files, type, index) => {
                              this.onImgChange(files, type, index,14);
                            }}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 5}
                            multiple={this.state.multiple} 
                      />
                    </Item>
                    <Item>
                      <p style = {{margin:'0',padding:'10px'}}>使用说明书</p>
                      <ImagePicker
                            files={instructionFiles}
                            onChange={(files, type, index) => {
                              this.onImgChange(files, type, index,15);
                            }}
                            onImageClick={(index, fs) => console.log(index, fs)}
                            selectable={files.length < 5}
                            multiple={this.state.multiple} 
                      />
                    </Item>
                  </List> 
                </div>
              )
          }
        </div> 
        <DevBrandRef submitBrandRef={ this.submitBrandRef } isShowBrandRef={ isShowBrandRef } />
      </div>
    );
  }
};

DeviceProviderApproachNoticeDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceProviderApproachNoticeDetail;
