import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import util from 'Utils/util';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/provider_devmat/page';

const tabs = [
  { title: '待评价' },
  { title: '已完成' },
];

class DeviceProviderMaintenanceList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      matState: 2,
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
    params.sortType = 'desc';
    params.sortField = 'exeStartTime';
    params.matState = this.state.matState;
    params.maType = 2;
    params.pageSize = 10;
    params.supplier = 2;
    params.conditionValue = this.state.conditionValue;
    params.supplierId = authToken.getSupId();
    params.supplierName = authToken.getSupName();
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;

      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/deviceProvider/deviceMaintenanceDetail/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.devName}</div>
                <div className='body-content'>{obj.devModel + ' . ' + obj.mgNo}</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.companyName}
                  </div>
                  <div className='body-date'>
                    {util.FormatDate(obj.modifytime,'date')}
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
          rightContent={
            <Link to={{pathname: '/deviceProvider/deviceMaintenanceAdd/'}}>
              <Icon key="0" type="plus" size={'xs'} color={'#3ac17e'} />
            </Link>
          }
        >设备保养</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const matStateList = [2, 3];
            console.log('matState === ', matStateList[index] );
            this.setState({ matState: matStateList[index] });
          }}
        >
          <div>
            <YYCardList 
              pageUrl={pageUrl} 
              params={params} 
              row={row}
              multi={true} />
          </div>
        </Tabs>
      </div>
    );
  }
}

DeviceProviderMaintenanceList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceProviderMaintenanceList;
