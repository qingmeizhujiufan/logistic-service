import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView, Toast } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl1 = MODULE_URL.DEVCONT_BASEHOST + '/spot/enternotice/list';
let pageUrl2 = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/list';
const tabs = [
  { title: '待验收' },
  { title: '已验收' },
];

class DeviceAcceptList extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      type: 1,
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
  
  //返回
  callback = () => {
    this.context.router.goBack();
  } 

  render() {
    const params1 = {};
    params1.sortField = "examTime";
    params1.sortType = "desc";
    params1.pageSize = 10;
    params1.conditionValue = this.state.conditionValue;
    params1.companyId = authToken.getOrgaId();
    params1.companyName = authToken.getOrgaName();
    params1.billState = 47;
    params1._we = 1;
    
    const params2 = {};
    params2.sortField = "examTime";
    params2.sortType = "desc";
    params2.pageSize = 10;
    params2.conditionValue = this.state.conditionValue;
    params2.companyId = authToken.getOrgaId();
    params2.companyName = authToken.getOrgaName();
    params2.type = this.state.type;
    
    const row1 = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceAcceptAdd/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.devName}</div>
                <div className='body-content'>{obj.devModel}</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.supplierName}
                  </div>
                  <div className='body-date'>
                    { obj.enterDate && obj.enterDate.substring(0, 10)}
                  </div>
              </div>
            </Link>
          </div>
      );
    };

    const row2 = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceAcceptDetail/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.devName}</div>
                <div className='body-content'>{obj.devModel} . {obj.billCode}</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.examUserName}
                  </div>
                  <div className='body-date'>
                    { obj.examTime}
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
        >进场验收</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const typeList = [1, 2];
            this.setState({ type: typeList[index] });
          }}
        >
          <div>
            <YYCardList 
              pageUrl={pageUrl1} 
              params={params1} 
              row={row1}
              multi={true} />
          </div>
          <div>
            <YYCardList 
              pageUrl={pageUrl2} 
              params={params2} 
              row={row2}
              multi={true} />
          </div>
        </Tabs>
      </div>
    );
  }
}  

DeviceAcceptList.contextTypes = {  
     router:React.PropTypes.object  
} 
export default  DeviceAcceptList;
