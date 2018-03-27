import React from 'react';
import { NavBar, Icon, Accordion, List, Button, Picker, DatePicker, TextareaItem, Switch, ImagePicker, Toast} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import Files from 'Utils/files';
import Util from 'Utils/util';
import '../deviceMaintenance.less';   
/* 引入自定义公共组件 */ 
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const deviceRepairsUrl = MODULE_URL.DEVCONT_BASEHOST + "/provider_devmat/findById"; 
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class DeviceMaintenanceDetail extends React.Component{     
    constructor(props) {
      super(props);
      this.state = {
        data:{},
        imgList: {
          attachesList: []
        },
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
      //附件 
      this.getAttachList(this.props.params.id,imgList,() =>{
          this.setState({
            imgList:imgList 
        });
      }); 
    }

    componentDidMount() {    
    }
    
    //获取附件
    getAttachList = (id,fileArray,callback) => {
      var params = {
            id: id,
            billType: 'DM01',
            type: '02'
          }; 
      Files.filesDownLoad(fileArray, params, callback);
    } 

    //返回
    callback = () =>{
      this.context.router.goBack();
    }

  render() {  
    const {data,imgList} = this.state;
    const AttachList = <YYShowAttachesList attachesList = {imgList.attachesList} />;
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备保养单</NavBar> 
        <div className='zui-content'> 
         <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
           <Accordion.Panel header="基本信息">
             <List className="my-list">
               <List.Item extra={data.creator} thumb={<span className="icon-device icon-device-project"></span>}>制单人</List.Item>  
               <List.Item extra={data.modifytime?data.modifytime.substring(0,10):''} thumb={<span className="icon-device icon-device-contract"></span>}>制单日期</List.Item>
               <List.Item extra={data.pjtName} thumb={<span className="icon-device icon-device-equipment"></span>}>项目名称</List.Item>
               <List.Item extra={data.contractName} thumb={<span className="icon-device icon-device-equipmentType"></span>}>合同名称</List.Item>
               <List.Item extra={data.devName } thumb={<span className="icon-device icon-device-equipmentNO"></span>}>设备名称</List.Item>
               <List.Item extra={data.devModel} thumb={<span className="icon-device icon-device-contract"></span>}>规格型号</List.Item> 
               <List.Item extra={data.mgNo} thumb={<span className="icon-device icon-device-equipmentType"></span>}>设备管理编号</List.Item>  
             </List>
           </Accordion.Panel>
         </Accordion>

         <div>
           <div className='zui-pane'>
             <h2 className='zui-pane-title'>保养信息</h2>
           </div>
           <List className="my-list">
             <List.Item extra={data.matType == 1 ? '维修' : '保养'}>维保类型</List.Item>
             <List.Item extra={data.matLevel == 1?'一级':(data.matLevel ==2?'二级':'三级')}>保养等级</List.Item>
             <List.Item extra={data.exeResult == 1? '已完成': '未完成'}>完成情况</List.Item>
             <List.Item extra={data.matPerson}>保养人员</List.Item>
             <List.Item extra={data.matCheck}>检查人员</List.Item> 
             <List.Item extra={Util.FormatDate(data.exeStartTime,'time')}>保养开始时间</List.Item>
             <List.Item extra={Util.FormatDate(data.exeEndTime,'time')}>保养结束时间</List.Item>
             <List.Item extra={data.content}>保养内容</List.Item> 
             <List.Item>{AttachList}</List.Item> 
           </List>
         </div>   

        <div className={data.progressState ===3?'':'statehide'}>
          <div className='zui-pane'>
            <h2 className='zui-pane-title'>评价信息</h2>
          </div>
          <List className="my-list">
            <List.Item extra={data.evlResult ==1 ? '已完成' : '未完成'}>完成情况</List.Item> 
            <List.Item extra={Util.FormatDate(data.evlStartTime,'time')}>维修开始时间</List.Item>
            <List.Item extra={Util.FormatDate(data.evlEndTime,'time')}>维修完成时间</List.Item> 
            <List.Item extra={data.evlPerson}>确认人</List.Item>
            <List.Item extra={data.evlLevel ==1?'优秀':(data.evlLevel ==2?'良好':(data.evlLevel ==3?'合格':'差'))}>评分</List.Item>
            <List.Item extra={data.evlContent}>评价内容</List.Item> 
          </List>
        </div> 

        </div>
      </div>
    );
  }
};

DeviceMaintenanceDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceMaintenanceDetail;
