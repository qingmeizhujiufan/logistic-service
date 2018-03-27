import React from 'react';
import { NavBar, Icon, Accordion, List, Button, Picker, DatePicker, TextareaItem, Switch, Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceMaintenance.less';
// import '../../../static/css/iconfont.css'; 
/* 引入参照 */  
import PsnRef from '../../../pub/refs/component/psnRef';
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devmat/findById';  
let deviceSaveUrl = MODULE_URL.DEVCONT_BASEHOST  + "/device_devmat/saveBill";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);  

class DeviceMaintenanceDetail extends React.Component{     
  constructor(props) {
    super(props);
    this.state = {
      dataContext: {
        examId: authToken.getStaff(),
        startdate: now,
        enddate:now 
      },
      data: {},  
      imgList: [],
      imgListExe: [],
      isShowDeviceRef:false,
      isShowPsnRef:false, 
      value:'',
      evlLevel: {
        value:1,
        label:'优秀'
      },
      psnName:'' 
    };
  }
  componentWillMount() {
    let param = {
      id: this.props.params.id, 
    };
    ajax.getJSON(
      pageUrl,
      param,
      data => {
        this.setState({
          data: data.backData
        });  
      } 
    );
    //报修附件
    let imgList = {
      attachesList: []
    };
    this.getAttachList(this.props.params.id,imgList,() =>{
        this.setState({
          imgList:imgList
      });
    });
    //保养附件
    let imgListExe = {
      attachesList: []
    };
    this.getExeList(this.props.params.id,imgListExe,() =>{
        this.setState({
          imgListExe:imgListExe
      });
    }); 
  }

  componentDidMount() {   
    this.setState({
      psnName: this.state.dataContext.examId.name
    })
  }
//打开人员参照
  openPsnRef = () => {
    this.setState({isShowPsnRef: true}, () => {
      console.log('openEvlWindow isShowPsnRef === ', this.state.isShowPsnRef);
    }); 
  }
// 打开设备参照
  openEvlWindow = () => {
    this.setState({isShowDeviceRef: true}, () => {
      console.log('openEvlWindow isShowDeviceRef === ', this.state.isShowDeviceRef);
    }); 
  }
// 关闭保养评价页面
  closeRefWindow = () => {
    this.setState({isShowDeviceRef: false});
    this.setState({isShowPsnRef: false}); 
  }
  //回调人员参照返回的值
  submitPsnRef = (psnInfo, type) => {
    switch(type){
      case 'open':
        console.log('deviceInfo == ', psnInfo);  
        let psnName = this.state.psnName;
        console.log(psnName)
        this.setState({ 
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

   //获取报修附件列表
  getAttachList = (id,imgArray,callback) => { 
        var params = {
          id: id,
          billType: 'DM01',
          type: '01'
        };
       files.filesDownLoad(imgArray, params, callback); 
  }

   //获取保养附件列表
  getExeList = (id,imgArray,callback) =>{ 
        var params = {
          id: id,
          billType: 'DM01',
          type: '02'
        };
       files.filesDownLoad(imgArray, params, callback); 
  }
  
   //保修评价确定
   saveCrrection = (data, dataContext) =>{
    console.log(data);
    console.log(dataContext);
    if(dataContext.startdate >= dataContext.enddate) {
        Toast.fail('维修开始时间不能大于维修结束时间');
        return;
    }
    if(this.state.value == null || this.state.value == '') {
        Toast.fail('请填写报修内容');
        return;
    }  
    data.evlStartTime = new Date(dataContext.startdate).getTime(); 
    data.evlEndTime = new Date(dataContext.enddate).getTime(); 
    data.progressState = 3;
    data.evlPersonId = authToken.getUserId();
    data.evlPerson = this.state.psnName;
    data.evlContent = this.state.value;
    data.evlLevel = this.state.evlLevel.value;
    console.log(data)
    ajax.postJSON(
      deviceSaveUrl, 
      JSON.stringify(data),
      data => {
        if(data.success) {
          console.log(data);
          this.closeRefWindow();
        } 
      } 
    );  

   }
// 返回
  callback = () =>{
    this.context.router.goBack();
  }

  render() {
    let value = this.state.value; 
    let dataContext = this.state.dataContext;
    let data = this.state.data;  
    let imgList = this.state.imgList || {};
    let imgListExe = this.state.imgListExe || {};
    let isShowDeviceRef = this.state.isShowDeviceRef;
    let isShowPsnRef = this.state.isShowPsnRef;
    let evlLevel = this.state.evlLevel;  
    let headerClass = `ref-window ${ isShowDeviceRef ? 'active' : '' }`;
    const evlLevelList = [
      {
        value: 1,
        label: '优秀'
      }, {
        value: 2,
        label: '良好'
      }, {
        value: 3,
        label: '合格'
      }, {
        value: 4,
        label: '差'
      }];
    console.log(imgList.attachesList)
    console.log(data);
    const AttachList = <YYShowAttachesList attachesList = {imgList.attachesList} />;
    const ExeList = <YYShowAttachesList attachesList = {imgListExe.attachesList} />;
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备保养单</NavBar>
        <div className={isShowDeviceRef== true?'bdscroll zui-content zui-scroll-wrapper':'zui-content zui-scroll-wrapper'}>
          <div class="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <List.Item extra={data.creator}>制单人</List.Item>  
                  <List.Item extra={data.modifytime?data.modifytime.substring(0,10):''}>制单日期</List.Item>
                  <List.Item extra={data.pjtName}>项目名称</List.Item>
                  <List.Item extra={data.contractName}>合同名称</List.Item>
                  <List.Item extra={data.devName}>设备名称</List.Item>
                  <List.Item extra={data.devModel}>规格型号</List.Item> 
                  <List.Item extra={data.mgNo}>设备管理编号</List.Item>  
                </List>
              </Accordion.Panel>
            </Accordion>
   
            <div className={data.progressState ===1?'statehide':''}>
              <div className='zui-pane'>
                <h2 className='zui-pane-title'>保养信息</h2>
              </div>
              <List className="my-list">
                  <List.Item extra={data.matType === 1?'保养':'保养'}>维保类型</List.Item> 
                  <List.Item extra={data.matLevel === 1?'一级':(data.matLevel ===2?'二级':'三级')}>保养等级</List.Item> 
                  <List.Item extra={data.exeResult ===1?'已完成':'未完成'}>完成情况</List.Item>
                  <List.Item extra={data.matPerson}>保养人员</List.Item>
                  <List.Item extra={data.matCheck}>检查人员</List.Item> 
                  <List.Item extra={Util.FormatDate(data.exeStartTime,'time')}>保养开始时间</List.Item>
                  <List.Item extra={Util.FormatDate(data.exeEndTime,'time')}>保养完成时间</List.Item>
                  <List.Item extra={data.content}>保养内容</List.Item> 
                  <List.Item>{ExeList}</List.Item> 
              </List>
            </div> 
            
            <div className={data.progressState ===3?'':'statehide'}>
              <div className='zui-pane'>
                <h2 className='zui-pane-title'>评价信息</h2>
              </div>
              <List className="my-list">
                    <List.Item extra={data.evlLevel  ===1?'完成':'未完成'}>完成情况</List.Item> 
                    <List.Item extra={Util.FormatDate(data.evlStartTime,'time')}>保养开始时间</List.Item>
                    <List.Item extra={Util.FormatDate(data.evlEndTime,'time')}>保养完成时间</List.Item>
                    <List.Item extra={data.evlPerson}>确认人</List.Item>
                    <List.Item extra={data.evlLevel === 1?'优秀':(data.evlLevel ===2?'良好':(data.evlLevel ===3?'合格':'差'))}>评分</List.Item> 
                    <List.Item extra={data.evlContent}>评价内容</List.Item>  
              </List>
            </div> 

            <div className={data.progressState ===2?'stateshow':'statehide'} style={{width:'100%',height:'40px'}}>
              <div className="footer-btn-group" > 
                <div className="btn" onClick={this.openEvlWindow}>保养评价</div>
              </div>
            </div> 
          </div>
        </div>
 
          <div className={headerClass}>
          <NavBar
              mode="light"
              icon={<Icon type="cross" />}
              leftContent="关闭" 
              onLeftClick={ this.closeRefWindow }
            >设备保养评价</NavBar>
          <div className='zui-content zui-scroll-wrapper'>
            <div class="zui-scroll">
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="基本信息">
                  <List className="my-list">
                    <List.Item extra={data.mgNo}>设备管理编号</List.Item>   
                    <List.Item extra={data.pjtName}>项目名称</List.Item> 
                    <List.Item extra={data.devName}>设备名称</List.Item>
                    <List.Item extra={data.contractName}>合同名称</List.Item>
                    <List.Item extra={data.devModel}>规格型号</List.Item>  
                  </List>
                </Accordion.Panel>
              </Accordion>
              
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="评价信息">
                  <List className="my-list" style={{marginTop:'10px'}}>
                    <List.Item
                      extra={<Switch  
                        checked = 'true'  
                        onClick={(checked) => {alert(checked)}}
                      />}

                    >完成情况</List.Item>
                    <Picker 
                      data={ evlLevelList } 
                      cols={1}
                      extra="请选择"
                      value={ [evlLevel.value] }
                      onChange={
                        (value) => {       
                          console.log('Picker value === ', value[0]);
                          evlLevel.value = value[0];
                          evlLevelList.map(function(item, index){
                            if(item.value === evlLevel.value){
                              evlLevel.label = item.label;
                            }
                          });
                          console.log('Picker evlLevel === ', evlLevel);
                          this.setState({ evlLevel: evlLevel });
                        }
                      }
                    >
                      <List.Item arrow="horizontal">评分</List.Item>
                    </Picker>

                    <DatePicker
                      mode="datetime"
                      title="选择日期"
                      extra="请选择"
                      value={dataContext.startdate}
                      onChange={ 
                        (date) => { 
                          dataContext.startdate = date;
                          this.setState({ dataContext:  dataContext});
                        } 
                      }
                     >
                       <List.Item arrow="horizontal">保养开始时间</List.Item>
                     </DatePicker>  
                     <DatePicker
                      mode="datetime"
                      title="选择日期"
                      extra="请选择"
                      value={dataContext.enddate}
                      onChange={ 
                        (date) => { 
                          dataContext.enddate = date;
                          this.setState({ dataContext:  dataContext});
                        } 
                      }
                     >
                       <List.Item arrow="horizontal">保养完成时间</List.Item>
                     </DatePicker>

                    <List.Item extra={this.state.psnName} arrow="horizontal" onClick={this.openPsnRef}>报修人</List.Item>
                    <List.Item >评价内容
                         <TextareaItem  
                            rows={6}  
                            placeholder='请输入保养工作评价内容详情'
                            onChange={
                              (value) => {  
                                this.setState({ value:  value});
                              }
                            }
                         />
                    </List.Item>
                  </List>
                </Accordion.Panel>
              </Accordion>

              <div className={data.progressState ===2?'stateshow':'statehide'}>
                <div className="footer-btn-group" > 
                  <div className="btn" onClick={ () => {this.saveCrrection(data,dataContext)}}>确定</div>
                </div>
              </div> 
            </div>
          </div>  
        </div>
        <PsnRef submitPsnRef={ this.submitPsnRef } isShowPsnRef={ isShowPsnRef } />
      </div>
    );
  }
};

DeviceMaintenanceDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceMaintenanceDetail;
