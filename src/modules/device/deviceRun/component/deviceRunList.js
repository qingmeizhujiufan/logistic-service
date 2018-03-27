import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/dev/pjtrun/page';

const tabs = [
  { title: '运行记录' },
  { title: '交接班记录' },
];

class DeviceRunList extends React.Component {
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
    params.type = this.state.type;
    params.pageSize = 10;
    params.conditionValue = this.state.conditionValue;
    params.companyId = authToken.getOrgaId();
    params.companyName = authToken.getOrgaName(); 
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      let centerItem = null;
      if(obj.type === 1){
        centerItem = (<Link to={{pathname: '/device/deviceCalendar/' + obj.id}}>
                        <div className='zui-table-view-cell-body'>
                          <div className='body-title'>{obj.devName}</div>
                          <div className='body-content'>{obj.devModel + ' · ' + obj.mgNo}</div>
                          {centerItem}
                        </div>
                        <div className='zui-table-view-cell-footer'>
                            <div className='body-post'>
                              {obj.supplierName}
                            </div>
                            <div className='body-date'>
                              { obj.month + ' 月 '}
                            </div>
                        </div>
                      </Link>) ;
      }else if(obj.type === 2){
        centerItem = (<Link to={{pathname: '/device/deviceHandover/' + obj.id}}>
                        <div className='zui-table-view-cell-body'>
                          <div className='body-title'>{obj.devName}</div>
                          <div className='body-content'>{obj.devModel + ' · ' + obj.mgNo}</div>
                          {centerItem}
                        </div>
                        <div className='zui-table-view-cell-footer'>
                            <div className='body-post'>
                              {obj.creator}
                            </div>
                            <div className='body-date'>
                              { obj.month + ' 月 '}
                            </div>
                        </div>
                      </Link>) ;
      }else if(obj.type) {
        centerItem = '';
      }

      return (
        <div key={rowID} className='zui-table-cell'>
          {centerItem}
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
        >设备运转</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const typeList = [1, 2];
            console.log('type === ', typeList[index] );
            this.setState({ type: typeList[index] });
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

DeviceRunList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceRunList;
