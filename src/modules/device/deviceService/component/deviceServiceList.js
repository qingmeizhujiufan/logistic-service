import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView, Toast } from 'antd-mobile'; 
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devmat/page';

const tabs = [ 
  { title: '待维修' },
  { title: '待评价' },
  { title: '已完成' },
];

class DeviceServiceList extends React.Component { 
  constructor(props) {
    super(props); 
    this.state = {
      conditionValue: '',
      matState:1
    };
  }
  componentWillMount = () => { 
  } 

    //搜索功能
  onSearch = (value) => {
    this.setState({
      conditionValue:value
    }) 
  }
  // 返回
  callback = () => {
    this.context.router.goBack();
  }
  // 路由跳转
  btnClick = (url) => {
    this.context.router.push(url);
  }
  render() {
    let params = {};
    params.matState=this.state.matState;
    params.maType=1;
    params.pageSize=10;
    params.conditionValue=this.state.conditionValue;
    params.companyId= authToken.getOrgaId();
    params.companyName= authToken.getOrgaName();
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return (
        <div key={rowID} style={{ marginBottom: 10, padding: 0, backgroundColor: '#fff', borderRadius: 7, boxShadow: '4px 4px 6px 0 rgba(214,203,203,0.4)', overflow: 'hidden' }}>
            <Link to={{pathname: '/device/deviceServiceDetail/' + (obj ? obj.id : null)}}>
              <div
                style={{
                  margin: '10px 0 0 15px',
                  lineHeight: '21px',
                  color: '#465261',
                  fontSize: 14,
                }}
              >{obj.devName}</div>
              <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#465261', lineHeight: '30px'}}>{obj.devModel} . {obj.mgNo}</div>
              <div style={{ position: 'relative', height: '40px', backgroundColor: '#f9f9f9' }}>
                  <div style={{ paddingLeft: '15px', opacity: 0.45, fontSize: 12, color: '#465261', letterSpacing: 0, lineHeight: '40px'}}>
                    {obj.companyName}
                  </div>
                  <div style={{position: 'absolute', right: 15, top: '50%', fontSize: 12, color: '#465261', lineHeight: '14px', opacity: 0.45, transform: 'translateY(-50%)'}}>
                    {obj.modifytime?obj.modifytime.substring(0, 10):''} 
                  </div>
              </div>
              </Link>
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
                <Link to={{pathname: '/device/deviceServiceAdd/'}}>
                  <Icon key="0" type="plus" color="#3ac17e" size="xs"/> 
                </Link>
              } 
            >设备维修</NavBar>
            <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />  
          <Tabs tabs={tabs}
            initialPage={0} 
            prerenderingSiblingsNumber={0}
            onChange={(tab, index) => { 
              const matStateList = [1, 2, 3];
              console.log('matState === ', matStateList[index] );
              this.setState({ matState: matStateList[index] });
            }}
          >
            <div>
              <YYCardList 
                pageUrl={pageUrl} 
                params={params} 
                row={row} 
                multi={true}/>
            </div>
          </Tabs> 
      </div>
    );
  }
}

DeviceServiceList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceServiceList;
