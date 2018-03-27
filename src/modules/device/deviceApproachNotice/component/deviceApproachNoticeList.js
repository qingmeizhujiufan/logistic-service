import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/enternotice/list';

const tabs = [
  { title: '审批通过' },
  { title: '待回复' },
  { title: '待确认' },
  { title: '已确认' },
];

class DeviceApproachNoticeList extends React.Component {
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
  
  //返回
  callback = () => {
    this.context.router.goBack();
  } 

  render() {
    const params = {};
    params.billState = this.state.billState;
    params.pageSize = 10;
    params.conditionValue = this.state.conditionValue;
    params.companyId = authToken.getOrgaId();
    params.companyName = authToken.getOrgaName(); 
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceApproachNoticeDetail/' + obj.id}}>
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
        >设备进场</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
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

DeviceApproachNoticeList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceApproachNoticeList;
