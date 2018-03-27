import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView, Toast } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/enternotice/slist';

const tabs = [
  { title: '收到通知' },
  { title: '待提交' },
  { title: '待确认' },
  { title: '已完成' },
];

class DeviceProviderApproachNoticeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      billState: '3',
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
    params.billState = this.state.billState;
    params.pageSize = 10;
    params.conditionValue = this.state.conditionValue;
    params.supplier = 1;
    params.supplierId =  authToken.getSupId();
    params.supplierName = authToken.getSupName();
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/deviceProvider/deviceApproachNoticeDetail/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.devName}</div>
                <div className='body-content'>{obj.devModel + ' · ' + obj.projectName}</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.supplierName}
                  </div>
                  <div className='body-date'>
                    { obj.enterDate && obj.enterDate.substring(0, 10)}进场
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
        >进场备货</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}}/>
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const billStateList = ['3', '45,48', '46','47'];
            console.log('billState === ', billStateList[index] );
            this.setState({ billState: billStateList[index] });
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
DeviceProviderApproachNoticeList.contextTypes = {  
     router:React.PropTypes.object  
} 
export default  DeviceProviderApproachNoticeList;
