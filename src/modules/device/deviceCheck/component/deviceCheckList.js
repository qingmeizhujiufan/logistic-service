import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar, Tabs, PullToRefresh, ListView } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from 'Comps/yyjzMobileComponents/yyCardList';

const pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/mobile/devcheck/page';

const tabs = [
  { title: '待整改' },
  { title: '待复查' },
  { title: '已完成' },
];

class DeviceCheck extends React.Component {
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

  callback = () => {
    this.context.router.goBack();
  }

  btnClick = (url) => {
    this.context.router.push(url);
  }

  render() {
    const params = {};
    params.sortField = "examTime";
    params.sortType = "desc";
    params.state = this.state.billState;
    params.pageSize = 10;
    params.name = this.state.conditionValue;
    params.companyId = authToken.getOrgaId();
    params.companyName = authToken.getOrgaName(); 
    params.searchText=this.state.conditionValue;
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData;
      let centerItem = null;
      if(obj.examState === 1){
        centerItem = <div className='body-content'>{'需整改 ' + obj.allCorrectCount + ' 项，已整改 ' + obj.correctedCount + ' 项'}</div>;
      }else if(obj.examState === 2){
        centerItem = <div className='body-content'>{'待整改项： ' + obj.allCorrectCount}</div>;
      }else if(obj.examState) {
        centerItem = '';
      }

      return (
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceCheckDetail/' + obj.id}}>
              <div className='zui-table-view-cell-body'> 
                <div className="listTop">
                  <span>{obj.devName}</span>
                  <span style={{position:'absolute',right:'10px',opacity:'0.45',fontSize:'12px'}}>
                  {obj.billCode}
                  </span>
                </div>   
                <div className='body-content'>{obj.devModel + ' · ' + obj.mgNo}</div>
                {centerItem}
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.examId.name}
                  </div>
                  <div className='body-date'>
                    { obj.createtime && obj.createtime.substring(0, 10)}
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
            <Link to={{pathname: '/device/deviceCheckAdd/'}}>
              <Icon key="0" type="plus" size={'xs'} color={'#3ac17e'} />
            </Link>
          }
        >设备检查</NavBar>
        <SearchBar placeholder="搜索" onSubmit={value => {this.onSearch(value)}} />
        <Tabs tabs={tabs}
          initialPage={0}
          prerenderingSiblingsNumber={0}
          onChange={(tab, index) => { 
            const billStateList = [1, 2, 3];
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

DeviceCheck.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  DeviceCheck;
