import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, Accordion, List} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import ajax from 'Utils/ajax';
import '../contractLedger.less';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';
const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + '/deviceleasecontract/findById';
 
class ContractLedgerDetail extends React.Component{
  constructor(props) {
    super(props); 
    this.state = {
      data: {},
      deviceList: []
    };
  }

  //初次渲染之前 请求数据
  componentWillMount = () => {
    let param = {
      id: this.props.params.id,
      dealRecent: 1
    };
    ajax.getJSON(
      findByIdUrl,
      param,
      data => {
        this.setState({
          data: data.backData
        });
        console.log('this data == ', this.state.data);
      }
    );
  } 

  //返回
  callback = () => {
    this.context.router.goBack();
  } 

  render() {
    let data = this.state.data;
    let deviceList = data.childrenDetail || []; 
    let baseInfoList = [{
      label: '制单人',
      value: data.creator
    }, {
      label: '制单日期',
      value: data.signDate
    }, {
      label: '框架协议',
      value: data.frameAgrtName
    }, {
      label: '合同编号',
      value: data.contCode
    }, {
      label: '合同名称',
      value: data.contName
    }, {
      label: '设备供方',
      value: data.insDisUnitName
    }, {
      label: '发票类型',
      value: data.invoiceType
    }, {
      label: '税率',
      value: data.taxRate + '%'
    }, {
      label: '合同总价',
      value: data.taxTotalMny
    }];
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备合同</NavBar>
        <div className='zui-content  zui-scroll-wrapper'>
          <div className="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion">
              <Accordion.Panel header="基本信息">
                <YYBaseInfo baseInfoList={baseInfoList} /> 
              </Accordion.Panel>
            </Accordion>
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>进场设备详情</h2>
            </div>
            {
              deviceList.map(function(item, index){
                  return  <div key={index} className='device-list'>
                              <div className='device-detail'>
                                <div className='header'>
                                  <span>{item.devName}</span>
                                  <span className='device-dec'>{item.devSpec}</span>
                                  <span className='approach-time'>
                                    <span>裸机单价：</span>
                                    <span>{item.leaseUnitCost + '元/台·'+((item.priceType === '0') ? '天':'月')}</span>
                                  </span>
                                </div>
                                <div className='bottom text-green'>
                                  <span>总数:{item.devNum + (item.devUnit ? item.devUnit : '台')}</span>
                                  <span>已进场:{item.inDevNum + (item.devUnit ? item.devUnit : '台')}</span>
                                  <span>租期:{item.leaseInterval + ((item.priceType === '0') ? '/天':'/月')}</span>
                                </div>
                                <Link to={{pathname: '/device/deviceApproachNoticeAdd/' + data.id +'/'+item.dictDevId}}>     
                                  <span className='show-detail-btn'>进场通知</span> 
                                </Link> 
                              </div>
                          </div>
              })
            }
          </div>
        </div>
      </div>
    );
  }
};

ContractLedgerDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default ContractLedgerDetail;
