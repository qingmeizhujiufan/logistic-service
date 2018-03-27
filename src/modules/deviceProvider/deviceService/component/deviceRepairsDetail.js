import React from 'react';
import { NavBar, Icon, Accordion, List, Button, Picker, DatePicker, TextareaItem, Switch, ImagePicker, Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceRepairs.less'; 
import PsnRef from '../../../pub/refs/component/psnRef';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';
 
const deviceRepairsUrl = MODULE_URL.DEVCONT_BASEHOST + "/provider_devmat/findById";
const deviceSaveUrl = MODULE_URL.DEVCONT_BASEHOST + "/provider_devmat/saveBill";
const historyUrl = MODULE_URL.DEVCONT_BASEHOST + "/provider_devmat/page";

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceRepairsDetail extends React.Component{     
    constructor(props) {
      super(props);
      this.state = {
        data:{},
        datadate: {
          startdate: now,
          enddate:now
        },   
        value:'',
        files: [], 
        itemData:{},
        isShowReplyRef:false,
        imgList: {
          attachesList: []
        },
        imgListExe: {
          attachesList: []
        },
        isShowRecRef:false
      }
    }

    componentWillMount() {
      let param = {
        id: this.props.params.id, 
      };
      ajax.getJSON(
        deviceRepairsUrl,
        param,
        data => {
          this.setState({
            data: data.backData
          });  
        } 
      ); 

      let imgList = {
        attachesList: []
      };  
      let imgListExe = {
        attachesList: []
      }; 

      //附件 
      this.getAttachList(this.props.params.id,[imgList,imgListExe],() =>{
          this.setState({
            imgList:imgList,
            imgListExe:imgListExe
        });
      }); 
    }

    componentDidMount() {    
    }

    //获取维修附件列表
    getAttachList = (id,fileArray,callback) => {
        let type = ['01','02']
        for(let i=0 ;i<type.length ;i++){
          var params = {
            id: id,
            billType: 'DM01',
            type: type[i]
          };
          if(i===0){
            Files.filesDownLoad(fileArray[0], params, callback);
          } else if(i===1){
            Files.filesDownLoad(fileArray[1], params, callback);
          }
        } 
           
           
    } 

    //打开回复窗口
    openReplyWindow = () => {
      this.setState({isShowReplyRef: true}, () => {
        console.log('openEvlWindow isShowReplyRef == ', this.state.isShowReplyRef);
      }); 
    }

    //关闭回复窗口
    closeRefWindow = () => {
      this.setState({isShowReplyRef: false}); 
    }

    //图片上传
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
        "DM01", 
        authToken, 
        source,
        (data) => {
          console.log('callback data === ', data);
         // itemData.attachesList = data.attachesList;
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

    //确定
    saveCrrection = () => {    
      let deviceInfo= this.state.data; 
      let itemData= this.state.itemData; 
      let datadate= this.state.datadate;
      if((this.state.matPerson || authToken.getSupName())== null || (this.state.matPerson || authToken.getSupName()) == '') {
         Toast.fail('请填写维修人员');
          return;
      } 
      if((this.state.matCheck || authToken.getSupName())== null || (this.state.matCheck || authToken.getSupName()) == '') {
          Toast.fail('请填写检查人员');
          return;
      } 
      if(datadate.startdate >= datadate.enddate) {
          Toast.fail('维修开始时间不能大于维修结束时间');
          return;
      }
      if(this.state.value == null || this.state.value == '') {
          Toast.fail('请填写报修内容');
          return;
      } 
      if(this.state.itemData.attachesList == null || this.state.itemData.attachesList == '') {
          Toast.fail('请上传附件');
          return;
      } 
      //deviceInfo.billCode = this.state.datacode.code; //单据编码
      deviceInfo.billType = 'DM01';
      deviceInfo.mgNo = deviceInfo.code;
      deviceInfo.devName = deviceInfo.name;
      deviceInfo.exeStartTime = new Date(datadate.startdate).getTime();  //开始时间
      deviceInfo.exeEndTime = new Date(datadate.enddate).getTime(); //结束时间
      deviceInfo.creatorid = authToken.getUserId();
      deviceInfo.creator = authToken.getUserName();
      deviceInfo.modifierid = authToken.getUserId();
      deviceInfo.modifier = authToken.getUserName();
      deviceInfo.matCheck = this.state.matCheck?(this.state.matCheck):(authToken.getSupName());
      deviceInfo.matPerson = this.state.matPerson?(this.state.matPerson):(authToken.getSupName());  
      deviceInfo.reporterName = authToken.getStaffName();
      deviceInfo.hasReport = 2;
      deviceInfo.matType = 1;
      deviceInfo.progressState = 2;
      deviceInfo.billState = 0; //自由态 
      deviceInfo.content = this.state.value; //内容 
      deviceInfo.matUpload = itemData.attachesList.map(function(item, index) {
              return item.gid;
            }).join(',');
      console.log(deviceInfo);
      ajax.postJSON(
        deviceSaveUrl, 
        JSON.stringify(deviceInfo),
        data => {
          if(data.success) { 
            this.context.router.goBack();
          } 
        } 
      );  
    }

    //打开历史记录
    openRecWindow = () =>{
      this.setState({ isShowRecRef:true }); 
    }

    //返回
    callback = () =>{
      this.context.router.goBack();
    }
// 关闭历史维修记录
    closeRecWindow = () =>{
      this.setState({isShowRecRef: false});
    }

  render() { 
    const {isShowReplyRef, data, value, files, datadate, isShowRecRef} = this.state;
    let imgList = this.state.imgList || {};
    let imgListExe = this.state.imgListExe || {};
    const AttachList = <YYShowAttachesList attachesList = {imgList.attachesList} />;
    const ExeList = <YYShowAttachesList attachesList = {imgListExe.attachesList} />;
    let headerClass = `ref-window ${ isShowReplyRef ? 'active' : '' }`;
    let recheaderClass = `ref-window ${ isShowRecRef ? 'active' : '' }`;  
    let historyParams = {}; 
        historyParams.pageSize = 10;
        //historyParams.companyId =  authToken.getOrgaId();
        historyParams.devId  = data.spotId; 
    const row = (rowData, sectionID, rowID) => {
            const obj = rowData;
              return (
                <div key={rowID} className={rowID ==0?'firstListHistory zui-table-cell':'zui-table-cell'}> 
                    <div className='zui-table-view-cell-body'> 
                      <div className="listTop">
                        <span>{obj.matType==1?'维修':'保养'}</span>
                         <span style={{position:'absolute',right:'10px'}} className={obj.progressState === 1? 'bgOrange':(obj.progressState === 2? 'bgRed': (obj.progressState === 3? 'bgGreen':'bgGray'))}>
                          {obj.progressState === 1? '已通知':(obj.progressState === 2? '待评价': (obj.progressState === 3? '已完成':'错误状态'))}
                         </span> 
                      </div>   
                      <div className='body-content'>(编制人：{obj.creator})</div> 
                    </div>
                    <div className='zui-table-view-cell-footer'>
                        <div className='body-post'>
                          备注：{obj.reportContent}
                        </div>
                        <div className='body-date'>
                          { obj.reportTime && obj.reportTime.substring(0, 10)}
                        </div>
                    </div> 
                </div>
              );
            }; 
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
            rightContent={
                <div onClick={() => this.openRecWindow()}>历史维修记录</div>
              }
          >设备维修单</NavBar> 
        <div className={isShowReplyRef== true?'bdscroll zui-content':'zui-content'}> 
         <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
           <Accordion.Panel header="基本信息">
             <List className="my-list">
               <List.Item extra={data.creator}>制单人</List.Item>  
               <List.Item extra={data.createtime?data.createtime.substring(0,10):''}>制单日期</List.Item>
               <List.Item extra={data.pjtName}>项目名称</List.Item>
               <List.Item extra={data.contractName}>合同名称</List.Item>
               <List.Item extra={data.devName}>设备名称</List.Item>
               <List.Item extra={data.devModel}>规格型号</List.Item> 
               <List.Item extra={data.mgNo}>设备管理编号</List.Item> 
               <List.Item extra={data.matType === 1?'维修':'保养'}>维保类型</List.Item> 
               <List.Item extra={data.matLevel === '1'?'一级':(data.matLevel ==='2'?'二级':'三级')}>维修等级</List.Item> 
             </List>
           </Accordion.Panel>
         </Accordion>

         {/*待维修详情start*/}
         <div className={data.hasReport ===1?'statehide':''}>
           <div className='zui-pane'>
             <h2 className='zui-pane-title'>报修信息</h2>
           </div>
           <List className="my-list">
                 <List.Item extra={data.reporterName}>报修人员</List.Item>
                 <List.Item extra={data.reportTime}>报修时间</List.Item>
                 <List.Item extra={data.reportContent}>报修内容</List.Item> 
                 <List.Item>{AttachList}</List.Item> 
           </List>
         </div>  
         <div style={{width:'100%',height:'40px'}} className={data.progressState ===1?'':'statehide'}>
          <div className="footer-btn-group" > 
            <div className='btn' onClick={this.openReplyWindow}>维修回复</div>
          </div>
         </div>
       </div>

      {/*维修回复弹出start*/}
       <div className={headerClass}>
         <NavBar
          mode="light"
          icon={<Icon type="cross" />}
          leftContent="关闭" 
          onLeftClick={ this.closeRefWindow }
         >维修回复</NavBar>
         <div className='zui-content sys-scroll'>
          <Accordion defaultActiveKey="0" className="my-accordion">
            <Accordion.Panel header="基本信息">
              <List className="my-list">
                <List.Item extra={data == undefined ?'':data.mgNo}>设备管理编号</List.Item>
                <List.Item extra={data == undefined ?'':data.pjtName}>项目名称</List.Item>
                <List.Item extra={data == undefined ?'':data.devName}>设备名称</List.Item>
                <List.Item extra={data == undefined ?'':data.contractName}>合同名称</List.Item>
                <List.Item extra={data == undefined ?'':data.devModel}>设备型号</List.Item>
                <List.Item extra={data.matLevel == 2? '二级' : data.matLevel == 3 ? '三级' : '一级'}>维修级别</List.Item>  
              </List>
            </Accordion.Panel>
          </Accordion>
          <Accordion defaultActiveKey="0" className="my-accordion">
            <Accordion.Panel header="维修信息">
              <List className="my-list" style={{marginTop:'10px'}}>
                <List.Item
                    extra={<Switch  
                      checked = 'true'  
                      onClick={(checked) => {alert(checked)}}
                    />}

                  >完成情况</List.Item> 
                <List.Item extra={ 
                  <TextareaItem  
                    rows = {2}
                    labelNumber={5}
                    defaultValue={authToken.getSupName()}   
                    onChange={
                      (value) => {  
                        this.setState({ matPerson:  value});
                      }
                    }
                  />    
                }>
                维修人员</List.Item>
                <List.Item extra={
                  <TextareaItem  
                    rows = {2}
                    labelNumber={5}
                    defaultValue={authToken.getSupName()}  
                    onChange={
                      (value) => {  
                        this.setState({ matCheck:  value});
                      }
                    }
                  />
                }>
                检查人员</List.Item>
                 <DatePicker
                    mode="datetime"
                    title="选择日期"
                    extra="请选择"
                    value={datadate.startdate}
                    onChange={ 
                      (date) => {  
                        datadate.startdate = date;
                        this.setState({ datadate:  datadate});
                      } 
                    }
                   >
                   <List.Item arrow="horizontal">维修开始时间</List.Item>
                 </DatePicker>
                 <DatePicker
                    mode="datetime"
                    title="选择日期"
                    extra="请选择"
                    value={datadate.enddate}
                    onChange={
                      (date) => {
                        datadate.enddate = date; 
                        this.setState({ datadate:  datadate});
                      }
                    }
                   >
                   <List.Item arrow="horizontal">维修结束时间</List.Item>
                 </DatePicker>
              </List>
              <List className="my-list" style={{marginTop:'10px'}}>
               <List.Item >情况描述
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
                  onImageClick={(index, fs) => console.log(index, fs)}
                  selectable={files.length < 5}
                  onAddImageClick={this.onAddImageClick}
                />
              </List>
            </Accordion.Panel>
          </Accordion> 

          <div style={{width:'100%',height:'40px'}}>
            <div className="footer-btn-group" > 
              <div className='btn' onClick={this.saveCrrection}>确定</div>
            </div>
          </div>
         </div> 
          
       </div>
  
      {/*维修回复弹出end*/}

      {/*待评价详情start*/}
      <div className={data.progressState ===1?'statehide':''}>
       <div className='zui-pane'>
         <h2 className='zui-pane-title'>维修信息</h2>
       </div>
       <List className="my-list">
         <List.Item extra={data.exeResult==1?'已完成':'未完成'}>完成情况</List.Item>
         <List.Item extra={data.matPerson}>维修人员</List.Item>
         <List.Item extra={data.matCheck}>检查人员</List.Item>
         <List.Item extra={Util.FormatDate(data.exeStartTime,'time')}>维修开始时间</List.Item>
         <List.Item extra={Util.FormatDate(data.exeEndTime,'time')}>维修结束时间</List.Item> 
         <List.Item extra={data.reportContent} className='textStyle'>维修内容</List.Item> 
          <List.Item>{ExeList}</List.Item> 
       </List>
      </div> 
      {/*待评价详情end*/}

      {/*已完成详情start*/} 

      <div className={data.progressState ===3?'':'statehide'}>
       <div className='zui-pane'>
         <h2 className='zui-pane-title'>评价信息</h2>
       </div>
       <List className="my-list">
         <List.Item extra={data.evlResult ==1 ? '已完成' : '未完成'}>完成情况</List.Item> 
         <List.Item extra={Util.FormatDate(data.evlStartTime,'time')}>维修开始时间</List.Item>
         <List.Item extra={Util.FormatDate(data.evlEndTime,'time')}>维修完成时间</List.Item> 
         <List.Item extra={data.evlPerson}>确认人</List.Item>
         <List.Item extra={data.evlLevelName}>评分</List.Item>
         <List.Item extra={data.evlContent}>评价内容</List.Item> 
       </List>
      </div>
      {/*已完成详情end*/}

      <div className={recheaderClass}>
        <NavBar
          mode="light"
          icon={<Icon type="cross" />}
          leftContent="关闭" 
          onLeftClick={this.closeRecWindow} 
          >历史维修记录
        </NavBar> 
        <div>
          <YYCardList 
            pageUrl={historyUrl} 
            params={historyParams} 
            row={row} />
        </div> 
      </div>

      </div>
    );
  }
};

DeviceRepairsDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceRepairsDetail;
