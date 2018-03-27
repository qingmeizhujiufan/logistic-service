import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/deviceleasecontract/page';
class ContractLedgerList extends React.Component{  
  constructor(props) {
    super(props); 
    this.state = {
      listData: [],
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
    let params = {};    
    params.type = '1';
    params.pageSize = 10;
    params.billState = '3'; 
    params.companyId = authToken.getOrgaId(); 
    params.searchText = this.state.conditionValue; 
    const row = (rowData, sectionID, rowID) => { 
      const obj = rowData;
       return ( 
        <div key={rowID} className='zui-table-cell'>
            <Link to={{pathname: '/device/contractLedgerDetail/' +  (obj ? obj.id : null)}}>
              <div className='zui-table-view-cell-body'>
                <div className='body-title'>{obj.contName}</div>
                <div className='body-content'>合同金额: {obj.taxTotalMny}元</div>
              </div>
              <div className='zui-table-view-cell-footer'>
                  <div className='body-post'>
                    {obj.supplierName}
                  </div>
                  <div className='body-date'>
                    {obj.createtime.substring(0, 10)} 签订
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
            >合同台账</NavBar>
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
} ;

ContractLedgerList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default ContractLedgerList;
