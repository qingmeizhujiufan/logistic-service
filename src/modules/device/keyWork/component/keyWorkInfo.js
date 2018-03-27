import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, TextareaItem, ImagePicker,Button } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
// import Files from '../../../core/files';
import '../keyWork.less';
// import '../../../static/css/iconfont.css';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';

class keyWorkInfo extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      data: {}, 
      userListInfo:[],
      files: [], 
    };
  }

  //首次渲染之前加载数据
  componentWillMount() {
    let param = {
      id: this.props.params.id, 
    };
    ajax.getJSON(
      MODULE_URL.DEVCONT_BASEHOST + '/device_devkwork/getExamInfo',
      param,
      data => {
        this.setState({
          data: data.backData
        });  
        console.log('this data == ', this.state.data);
      } 
    );
  }

  //附件上传
  onChange = (files, type, index) => {
      console.log(files, type, index);
      this.setState({
        files,
      });
  }
  
  //返回
  callback = () => {
    this.context.router.goBack();
  }
  
  render() { 
    let data = this.state.data;  
    let userlist =  this.state.data.impInfos || [];
    let files = this.state.files;    
    let baseInfoList = [{
      label: '关键作业编号',
      value: data.billCode
    }, {
      label: '设备管理编号',
      value: data.mgNo
    }, {
      label: '设备名称',
      value: data.devName
    }, {
      label: '项目名称',
      value: data.pjtName
    }, {
      label: '作业单位',
      value: data.workComp
    }, {
      label: '作业类别',
      value: data.workType ? data.workType.name : ''
    }, {
      label: '作业方案',
      value: data.schemeName
    }, {
      label: '计划开始时间',
      value: data.startTime
    }, {
      label: '计划结束时间',
      value: data.endTime
    }];
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >记录单详情</NavBar>
        <div className='zui-content  zui-scroll-wrapper'>
          <div className="zui-scroll">
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
               <YYBaseInfo baseInfoList={baseInfoList} />
            </Accordion.Panel>
          </Accordion> 
          <List>
            <List.Item>
              <span style={{color:'#8f8f94'}}>旁站人员名单</span>
              <div style={{height:'100px',padding:'0 15px'}}> 
                     {
                      userlist.map(function(datad,index){
                        return( 
                            <div key={index} style={{width:'20%',textAlign:'center',marginTop:'10px'}}>
                              <div className={index == 1?'personStyClick':'personStyNotClick'} onChange={''}>{datad.userName}</div> 
                            </div>   
                      )}) 
                     }
              </div>  
            </List.Item> 
          </List> 
          <div className={(data.creatorid == authToken.getUserId())?'statehide':''}>  
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>{userlist ==''?'':userlist[0].userName}的旁站记录</h2>
            </div>
            <List className="my-list">
              <List.Item extra={userlist ==''?'':userlist[0].deptName}>部门</List.Item>
              <List.Item extra={userlist ==''?'':userlist[0].standDate}>旁站时间</List.Item> 
              <List.Item extra={userlist ==''?'':userlist[0].description}>记录详情</List.Item> 
            </List>

            <div className={((userlist ==''?'':userlist[0].userId) === authToken.getStaffId())?'':'statehide'}>
              <div className='zui-pane'>
                <h2 className='zui-pane-title'>填写旁站记录</h2>
              </div>
              <List className="my-list" style={{marginTop:'10px'}}> 
               <DatePicker
                mode="date"
                title=""
                extra="请选择"
                value={this.state.date}
                onChange={date => this.setState({ date })}
               >
                 <List.Item arrow="horizontal">报修时间</List.Item>
               </DatePicker>
               <List.Item >情况描述
                 <TextareaItem  
                    autoHeight
                    labelNumber={5}
                    placeholder='请输入'
                 />
               </List.Item>
               <ImagePicker
                  files={files}
                  onChange={this.onChange}
                  onImageClick={(index, fs) => console.log(index, fs)} 
               />
              </List> 
            </div>
          </div>

            <div>
              {
                userlist.map(function(datad,index){
                  console.log(authToken.getStaffId())
                  console.log(datad.userId)
                  console.log(authToken.getUserId())
                  console.log(data.creatorid)
                  return( 
                      <div key={index}>
                        <div className={((data.creatorid==authToken.getUserId())&&(datad.userId!=authToken.getStaffId()))?'':'statehide'}>
                           <div className="footer-btn-group" > 
                             <div className="btn" onClick={() => {''}}>提交</div>
                           </div>
                        </div>
                      </div>   
                )}) 
              }
            </div> 
          </div>
        </div>
      </div>
    );
  }
};

keyWorkInfo.contextTypes = {  
     router:React.PropTypes.object  
} 
export default keyWorkInfo;
