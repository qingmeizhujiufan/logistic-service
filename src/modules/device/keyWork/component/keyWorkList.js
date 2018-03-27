import React from 'react';
import { Link } from 'react-router';
import { NavBar, Icon, SearchBar } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../keyWork.less';
// import '../../../static/css/iconfont.css';
/* 调用自定义公共组件 */ 
import YYCardList from '../../../../components/yyjzMobileComponents/yyCardList';

let pageUrl = MODULE_URL.DEVCONT_BASEHOST + '/device_devkwork/mobilePage';  

class KeyWorkList extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      conditionValue:''
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
    params.workState = '-3'; 
    params.pageSize = 10; 
    params.companyId = authToken.getOrgaId();
    params.conditionValue=this.state.conditionValue; 
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData; 
      return (
        <div key={rowID} style={{ marginBottom: 10, padding: 0, backgroundColor: '#fff', borderRadius: 7, boxShadow: '4px 4px 6px 0 rgba(214,203,203,0.4)', overflow: 'hidden' }}>
            <Link to={{pathname: '/device/keyWorkDetail/' + obj.id}}> 
              <div style={{width:'80%',borderRight:'1px solid #e4e4e4',float:'left'}}>
                <div style={{ paddingLeft: '15px', fontSize: '14px', color: '#465261', lineHeight: '30px'}}>{obj.devName}.{obj.devModel}</div>
                <div style={{lineHeight: '30px'}}>
                 <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#465261', lineHeight: '30px', width: '50%'}}>
                    <span>{obj.mgNo} </span>
                 </div>
                </div> 
                <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#465261', lineHeight: '30px'}}>始：<span style={{color:'#3ac17e'}}>{(obj.startTime).substring(0,10)}</span>&nbsp;终：<span style={{color:'#3ac17e'}}>{(obj.endTime).substring(0,10)}</span></div>
                <div style={{ position: 'relative', height: '40px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ paddingLeft: '15px', opacity: 0.45, fontSize: 12, color: '#465261', letterSpacing: 0, lineHeight: '40px'}}>
                      <span className='iconfont icon-label' style={{color:'#1ea5f5',verticalAlign:'-6px'}}></span>
                      <span>{obj.workComp}</span>
                    </div> 
                </div>
              </div> 
              </Link>
              <Link to={{pathname: '/device/keyWorkInfo/' + obj.id}}>
                <div className='addside'>
                   <span style={{position:'relative',top:'40%'}}><span>添加<br />旁站</span></span>
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
            >关键作业管理</NavBar>
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

KeyWorkList.contextTypes = {  
     router:React.PropTypes.object  
} 

export default KeyWorkList;
