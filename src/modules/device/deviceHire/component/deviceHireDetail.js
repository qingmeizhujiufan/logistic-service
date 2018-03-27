import React from 'react';
import { NavBar, Icon, Accordion, List } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../deviceHire.less';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devrent/rent/findById';  

class DeviceHireDetail extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      data: {},  
      devicelist: [],
    };
  }

  //初次渲染之前请求数据
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
  }

  //返回
  callback = () => {
    this.context.router.goBack();
  }

  render() {
    let data = this.state.data;   
    let deviceList = data.childrenDetail || [];
    let baseInfoList = [{
      label: '设备管理编号',
      value: data.mgNo
    }, {
      label: '项目名称',
      value: data.pjtName
    }, {
      label: '合同名称',
      value: data.contractName
    }, {
      label: '设备名称',
      value: data.devName
    }, {
      label: '设备型号',
      value: data.devModel
    }, {
      label: '出租单位',
      value: data.hireCompId ? data.hireCompId.name : ''
    }]
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback} 
          >设备启停租单</NavBar>
        <div className='zui-content zui-scroll-wrapper'>
          <div className="zui-scroll">
          <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="基本信息">
              <YYBaseInfo baseInfoList={baseInfoList} />
            </Accordion.Panel>
          </Accordion>
          <div className='zui-pane'>
            <h2 className='zui-pane-title'>启停租信息</h2>
          </div>
          <List className="my-list">
                <List.Item extra={data.stateType =='2'?'启租':'停租'}>启停租</List.Item>
                <List.Item extra={data.startTime}>执行时间</List.Item>
                <List.Item extra={data.memo}>情况描述</List.Item> 
          </List>
          </div>
        </div>
      </div>
    );
  }
};

DeviceHireDetail.contextTypes = {  
     router:React.PropTypes.object  
}  
export default DeviceHireDetail;
