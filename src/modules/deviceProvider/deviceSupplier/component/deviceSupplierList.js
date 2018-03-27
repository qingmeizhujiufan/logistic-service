import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import util from 'Utils/util';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devcheck/page';

const tabs = [
  { title: '待处理' },
  { title: '处理中' },
  { title: '已完成' },
];

class DeviceSupplierList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      billState: 1,
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
    params.state = this.state.billState;
    params.pageSize = 10;
    params.supplier = 1;
    params.conditionValue = this.state.conditionValue;
    params.supplierId = authToken.getSupId();
    params.supplierName = authToken.getSupName();
    params.userId = authToken.getUserId();
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;

      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/deviceProvider/deviceSupplierDetails/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.devName + ' ' + obj.devModel}</div>
                <div className='body-content'>{obj.mgNo == null ? '' : obj.mgNo }</div>
                <div className='body-content'>{obj.providerName}</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.pjtName}
                  </div>
                  <div className='body-date'>
                    检查时间 ：{util.FormatDate(obj.examTime,'date')}
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
        >设备整改单</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}}/>
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const billStateList = [1, 2, 3];
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

DeviceSupplierList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceSupplierList;
