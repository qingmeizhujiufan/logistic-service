import React from 'react';
import { WhiteSpace, NavBar, Icon, ListView, List, Radio } from 'antd-mobile';
import '../refs.less';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';

let companyUrl = MODULE_URL.COMPANY_REF_URL + "/company/getRefCompany";
var psnUrl = MODULE_URL.COMPANY_REF_URL + "/staff/gridRefNew";

const Item = List.Item;
const RadioItem = Radio.RadioItem;

class PsnRef extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyList: [],
      selectedCompany: {},
      listData: [],
      selectedData: {},
      isShowPsnRef: false
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isShowPsnRef){
      this.setState({
        isShowPsnRef: nextProps.isShowPsnRef
      }, () => {
        const params = {};
        params.pageNumber = 1;
        params.pageSize = 999;
        params.condition = JSON.stringify({companyId: authToken.getOrgaId()});
        this.getRefCompanyData(params);
      });
    }
  }

  getListData = (callback) => {
    const { selectedCompany } = this.state;
    let params = {};
    params.pageNumber = 1;
    params.pageSize = 999;
    params.searchText = ''; 
    params.relyCondition = 'companyId=' + selectedCompany.id;
    params.condition = JSON.stringify({companyId: selectedCompany.id});
    ajax.getJSON(
      psnUrl,
      params,
      (data) => {
        console.log('comget ajax back == ', data);
        if(typeof callback === 'function')
          callback(data);
      }
    );
  }

  onChange = (val) => {
    console.log('this selectedData  == ', val);
    this.setState({
      selectedData: val
    });
  }

  onCompanyChange = (val) => {
    if(val.id === this.state.selectedCompany.id) return;
    this.setState({
      selectedCompany: val
    }, () => {
      this.getListData((data) => {
        const { listData } = this.state;
        const content = data.data.content;
        console.log('content === ', content);
        this.setState({
          listData: content,
        });
      });
    });
  }

  closeRefWindow = () => {
    this.setState({isShowPsnRef: false});
  }

  getRefCompanyData = (params) => {
    console.log('getRefCompanyData   11111111111=====2222====');
    ajax.getText(
      companyUrl,
      params,
      (data) => {
        var data = JSON.parse(data);
        console.log('company list === ', data);
        if(data)
          this.setState({
            companyList: data
          });
      }
    );
  }

  render() {
    let { listData, selectedData, isShowPsnRef, companyList, selectedCompany } = this.state;
    let that = this;
    let headerClass = `ref-window ${ isShowPsnRef ? 'active' : '' }`;
    return (
      <div className={headerClass}>
        <NavBar
          mode="light"
          icon={<Icon type="cross" />}
          leftContent="关闭" 
          onLeftClick=
          { 
            () => {
            this.closeRefWindow();
            return this.props.submitPsnRef(null, 'close')} 
          }
            rightContent=
            {
              <div onClick={ () => {
                this.closeRefWindow();
                return this.props.submitPsnRef(selectedData, 'open')
              }}>确定</div>
            }
        >人员参照</NavBar>
        <div className='zui-sub-content'>
            <List>
              {
                companyList.map(function(item, index){
                  return (
                    <RadioItem 
                      key={index} 
                      checked={selectedCompany.id === item.id}
                      onChange={() => {
                        that.onCompanyChange(item);
                      }} 
                    >
                      <div style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
                          <div
                            style={{
                              margin: '10px 0 0 15px',
                              lineHeight: '21px',
                              color: '#465261',
                              fontSize: 14,
                            }}
                          >{item.name}</div>
                          <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#465261', lineHeight: '30px'}}>{item.code}</div>
                      </div>
                    </RadioItem>
                  )
                })
              }
            </List>
            <List>
              {
                listData.map(function(item, index){
                  return (
                    <RadioItem key={item.id + '_' + item.property} checked={selectedData.id === item.id} onChange={() => that.onChange(item)} >
                      <div style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
                          <div
                            style={{
                              margin: '10px 0 0 15px',
                              lineHeight: '21px',
                              color: '#465261',
                              fontSize: 14,
                            }}
                          >{item.name}</div>
                          <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#465261', lineHeight: '30px'}}>{item.code + ' | ' + item.property}</div>
                      </div>
                    </RadioItem>
                  )
                })
              }
            </List>
        </div>
      </div>
    );
  }
}

export default PsnRef;