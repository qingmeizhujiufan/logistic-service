import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';
import '../deviceRecord.less';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/devRecord/list';

class DeviceRecordList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conditionValue: ''
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
    const params = {};
    params.pageSize = 10;
    params.conditionValue = this.state.conditionValue;
    params.companyId = authToken.getOrgaId();
    params.companyName = authToken.getOrgaName(); 
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return ( 
          <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceMessage/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
               <div className="listTop">
                  <span>{obj.devName}</span>
                  <span style={{float:'right',fontSize:'12px'}} className={obj.devState == '1'? 'bg_orange':(obj.devState == '2'? 'bg_green': (obj.devState == '3'? 'bg_gray':'bg_red'))}>
                    {obj.devState == 1? '未启用':(obj.devState == 2? '启租': (obj.devState == 3? '停租':'退场'))}
                  </span>
               </div> 
               <div className='body-content'>{obj.devModel}.{obj.mgNo}</div>
              </div>
              <div className='listFooter'>
                  <div className='listFooterLeft'>
                    {obj.pjtName}
                  </div>
                  <div className='listFooteRight'>
                    {obj.startTime} 
                  </div>
              </div>
            </Link>
        </div>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          leftContent="返回" 
          onLeftClick={this.callback}
        >单机档案</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
        <div>
          <YYCardList 
            pageUrl={pageUrl} 
            params={params} 
            row={row} />
        </div>
      </div>
    );
  }
}

DeviceRecordList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceRecordList;
