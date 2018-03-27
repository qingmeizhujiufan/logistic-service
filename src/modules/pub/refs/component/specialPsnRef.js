import React from 'react';
import { NavBar, Icon, ListView, List, Radio, Toast} from 'antd-mobile';
import '../refs.less';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';

var specialPsnUrl = MODULE_URL.SECURITY_BASEHOST + '/specialWorker/refList';

const RadioItem = Radio.RadioItem; 

class SpecialPsnRef extends React.Component {
  constructor(props) {
    super(props);
   
    this.state = {
      pageIndex: 1,
      count: 0,
      pageCount: 0,
      listData: [],
      selectedData: {},
      isShowSpecialPsnRef: false,
      supId:''
    };
  }

  componentWillMount() {  
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    let callback = () => {
      console.log(this.props.supId)
      this.getListData((data) => {
        const content = data.data.content;
        this.setState({
          listData: content,
          count: data.data.count,
          pageCount: data.data.pageCount
        });
      });
    };
    this.setState({
      supId:nextProps.supId,
      isShowSpecialPsnRef: nextProps.isShowSpecialPsnRef
    }, () => {
      if(nextProps.isShowSpecialPsnRef === true)
        callback();
    });
  }

  genData(data) {
    let dataBlob = {};
    for (let i = 0; i < data.length; i++) {
      dataBlob[`${i}`] = data[i];
    }
    return dataBlob;
  }

  getListData = (callback) => {  
    let params = {};
    params.pageNumber = this.state.pageIndex;
    params.pageSize = 10;
    params.conditionValue = ''; 
    params.condition = JSON.stringify({
      projectId: '',
      unitNameId: this.state.supId,
    });
    Toast.loading('加载中...', 0);
    ajax.getJSON(
      specialPsnUrl,
      params,
      (data) => {
        console.log('comget ajax back == ', data);
        if(typeof callback === 'function')
          callback(data);
        Toast.hide();
      }
    );
  }

  onChange = (val) => {
    console.log('this selectedData  == ', val);
    this.setState({
      selectedData: val
    });
  }

  closeRefWindow = () => {
    this.setState({isShowSpecialPsnRef: false});
  }

  prevPage = () => {
    let { pageIndex } = this.state;
    if(pageIndex === 1){
        Toast.info('已到起始页', 1);
        return;
    }
    this.setState({
        pageIndex: --pageIndex
    }, () => {
        this.getListData((data) => {
            const content = data.data.content;
            this.setState({
                listData: content
            });
        });
    });
  }

  nextPage = () => {
      let { pageIndex, pageCount } = this.state;
      if(pageIndex === pageCount){
          Toast.info('已到最后一页', 1);
          return;
      }
      this.setState({
          pageIndex: ++pageIndex
      }, () => {
          this.getListData((data) => {
              const content = data.data.content;
              this.setState({
                  listData: content
              });
          });
      });
  }
  render() {
    let { listData, selectedData, isShowSpecialPsnRef, pageIndex, pageCount, supId } = this.state;
    let headerClass = `ref-window ${ isShowSpecialPsnRef ? 'active' : '' }`;
    let prevClass = `btn prev-btn ${pageIndex === 1 ? 'disable' : ''}`;
    let nextClass = `btn next-btn ${pageIndex === pageCount ? 'disable' : ''}`;
    console.log(supId);
    console.log(isShowSpecialPsnRef)
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
              return this.props.submitSpecialPsnRef(selectedData, 'open')
            }}>确定</div>
          }
        >特种人员参照</NavBar>
        <div className='zui-sub-content marginBttom45'>
          <List>
            {
                listData.map((item, index) => {
                    return <RadioItem
                        key={index}
                        checked={selectedData.id === item.id}
                        onChange={(e) => {
                            console.log('e  == ', e);
                            this.onChange(item);
                        }}
                    >
                      <div style={{ position: 'relative', padding: 0, overflow: 'hidden' }}>
                        <div style={{
                            margin: '10px 0 0 15px',
                            lineHeight: '21px',
                            color: '#465261',
                            fontSize: 14, 
                        }}>{item.name}</div>
                        <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#999', lineHeight: '30px'}}>{item.code + ' | ' + item.certificateNumber}</div>
                        <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#999', lineHeight: '30px'}}>{item.projectName + ' | ' + item.unitNameId.name}</div>
                      </div>
                    </RadioItem>
                })
            }
          </List>
        </div>
        <div className='pagebtn-group'>
          <div className={prevClass} onClick={this.prevPage}><span>《 上一页</span></div>
          <div className='btn'>
            <span className='cur-page'>当前第 <strong>{pageIndex}</strong> 页</span>
            <div className='page-info'>
              <span>每页10条，</span>
              <span>共{pageCount}页</span>
            </div>
          </div>
          <div className={nextClass} onClick={this.nextPage}><span>下一页 》</span></div>
        </div>
      </div>
    );
  }
}

export default SpecialPsnRef;