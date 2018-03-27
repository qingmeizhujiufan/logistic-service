import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../deviceHire.less';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';
 
let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/provider_devrent/rent/page';  

class deviceHireList extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      conditionValue: '',
    };
  }
  componentWillMount() { 
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
    let params = {};  
    params.pageSize = 10; 
    params.companyId = authToken.getOrgaId();
    params.companyName = authToken.getOrgaName(); 
    params.conditionValue=this.state.conditionValue;
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData; 
      return (
 
          <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/deviceHireDetail/' + obj.id}}>
              <div className='zui-table-view-cell-body'>
                <div className="listTop">
                  <span>{obj.devName}</span>
                  <span style={{position:'absolute'}} className={obj.stateType ===2?'bg-blue':'bg-gray'}>
                    {obj.stateType === 1? '未启用':(obj.stateType === 2? '启租': (obj.stateType === 3? '停租':'退场'))}
                  </span>
                </div>             
              <div className='body-content'>{obj.devModel}.{obj.mgNo}</div>
              </div>
              <div className='listFooter'>
                  <div className='listFooterLeft'>
                    {obj.supplierName}
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
              icon={<Icon type="left" />}
              leftContent="返回" 
              mode="light" 
              onLeftClick={this.callback} 
              rightContent={ 
              	<Link to={{pathname: '/device/deviceHireAdd/'}}>
	              	<Icon key="0" type="plus" color="#3ac17e" size="xs"/> 
				        </Link>
				      } 
            >设备启停租</NavBar>
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
};

deviceHireList.contextTypes = {  
     router:React.PropTypes.object  
}

export default deviceHireList;
