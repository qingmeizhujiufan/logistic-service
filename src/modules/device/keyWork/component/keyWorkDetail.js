import React from 'react';
import { NavBar, Icon, Accordion, List } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../keyWork.less';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devkwork/getDataById';  
let pageDataUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/findSpotInfo';

class keyWorkDetail extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      data: {}, 
      data_id: {}, 
      userlist: [],
    };
  }

  //首次渲染之前加载数据
  componentWillMount() {  
     this.getData((data) =>{
      const datainfo = data.backData; 
      let param = {
        spotId: datainfo.spotId, 
      };
      ajax.getJSON(
        pageDataUrl,
        param,
        data => {
        var backData = data.backData;   
        this.setState({
          data_id: backData,
          data:datainfo,
        }); 
        }  
      )
     })
  }

  //获取数据
  getData = (callback) => {
    let param = {
      id: this.props.params.id, 
    };
    ajax.getJSON(
      pageUrl,
      param,
      // data => {
        // var backData = data.backData;   
        // this.setState({
        //   data: backData
        // });   
        function(data){
        callback(data); 
      }
      // } 
    );
  }

  //返回
  callback = () => {
    this.context.router.goBack();
  }
  
  render() {
    let data = this.state.data;    
    console.log(data);
    let data_id = this.state.data_id;
    console.log(data_id);  
    let userlist =  this.state.data.userInfos || [];
    console.log(userlist);
    let baseInfoList = [{
      label: '项目名称',
      value: data.pjtName
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
      label: '安装单位',
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
          >关键作业</NavBar>
        <div className='zui-content  zui-scroll-wrapper'>
          <div className="zui-scroll">
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
              <YYBaseInfo baseInfoList={baseInfoList} />
            </Accordion.Panel>
          </Accordion>
          <div className='zui-pane'>
            <h2 className='zui-pane-title'>现场准备情况</h2>
          </div>
           <List className="my-list">
                <List.Item>设备基础尺寸及位置符合基础方案
                  <span style={{float:'right'}}>
                    <span className={data.baseScheme===-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.baseScheme===-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.baseScheme===-1?'text_n':'text_y'}>{data.baseScheme===-1?'否':'是'}</span>
                  </span>
                </List.Item>
                <List.Item>设备基础强度是否达到要求
                  <span style={{float:'right'}}>
                    <span className={data.baseStrength===-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.baseStrength===-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.baseStrength===-1?'text_n':'text_y'}>{data.baseStrength===-1?'否':'是'}</span>
                  </span>
                </List.Item>
                <List.Item>项目计划安排旁站监督人员
                  <span style={{float:'right'}}>
                    <span className={data.checkMan===-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.checkMan===-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.checkMan===-1?'text_n':'text_y'}>{data.checkMan===-1?'否':'是'}</span>
                  </span>
                </List.Item> 
                <List.Item>现场道路及场地是否满足安装要求
                  <span style={{float:'right'}}>
                    <span className={data.road===-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.road===-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.road===-1?'text_n':'text_y'}>{data.road===-1?'否':'是'}</span>
                  </span>
                </List.Item>
                <List.Item>应急准备人员及物资是否准备完毕
                  <span style={{float:'right'}}>
                    <span className={data.prepareMan===-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.prepareMan===-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.prepareMan===-1?'text_n':'text_y'}>{data.prepareMan===-1?'否':'是'}</span>
                  </span>
                </List.Item>
                <List.Item>起重机械安装（拆卸）方案是否审批
                  <span style={{float:'right'}}>
                    <span className={data.schemeApprove==-1?'icon-no-style':'icon-yes-style'}>
                     <span className={data.schemeApprove==-1?'icon-no':'icon-yes'}></span>
                    </span>
                    <span className={data.schemeApprove==-1?'text_n':'text_y'}>{data.schemeApprove==-1?'否':'是'}</span>
                  </span>
                </List.Item> 
                <List.Item>设备租赁合同编号及安全协议签订情况
                  <div style={{color:'#8d9098'}}>{data_id.contractName}({data_id.contractNo})</div>
                </List.Item>
                <List.Item>设备专用电源箱位置和容量情况
                  <div style={{color:'#8d9098'}}>{data.energe}</div>
                </List.Item> 
          </List>  
            <div className='zui-pane'>
                <h2 className='zui-pane-title'>旁站人员</h2>
            </div>
            <div>
            {
              userlist.map(function(datad,index){
                return(
                <List className="my-list" key={index} style={{marginTop:'10px'}}>
                      <List.Item extra={datad.userNo}>人员编号</List.Item>
                      <List.Item extra={datad.userName}>人员姓名</List.Item>
                      <List.Item extra={datad.postName}>所属岗位</List.Item>
                      <List.Item extra={datad.deptName}>所属部门</List.Item> 
                </List>  
              )}) 
            }
            </div>
          </div>
        </div>  
      </div> 
    );
  }
}

keyWorkDetail.contextTypes = {  
     router:React.PropTypes.object  
}  

export default keyWorkDetail;
