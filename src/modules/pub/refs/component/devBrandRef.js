import React from 'react';
import { NavBar, Icon, ListView, List, Radio, Toast} from 'antd-mobile';
import '../refs.less';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';

let pageUrl = MODULE_URL.GUIDESELF + "/refer/findByCode";
let devBrandRefUrl;
 
const RadioItem = Radio.RadioItem;
 
class DevBrandRef extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {  
      pageIndex: 1,
      count: 0,
      pageCount: 0,
      listData: [],
      selectedData: {},
      isShowBrandRef: false
    };
  }

  componentWillMount() {
    // this.setState({isShowBrandRef: this.props.isShowBrandRef});   
  }

  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    let callback = () => {
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
      isShowBrandRef: nextProps.isShowBrandRef
    }, () => {
      if(nextProps.isShowBrandRef === true)
        callback();
    });
  }
 
  getListData = (callback) => {
    let param = {};
    param.refCode = 'defdoc-device_brand_fq';
    ajax.getJSON(
      pageUrl,
      param,
      (data) => {
        console.log('comget ajax back == ', data);
        let devBrandRefUrl = data.data.dataurl;
        let params = {};
        params.pageNumber = this.state.pageIndex;
        params.pageSize = '10';
        console.log(devBrandRefUrl)
        ajax.getJSON(
          devBrandRefUrl,
          params,
          (data) => {
            callback(data)
          }
        )
      }
    ) 
  }

  onChange = (val) => {
    console.log('this selectedData  == ', val);
    this.setState({
      selectedData: val
    }) 
  }

  closeRefWindow = () => {
    this.setState({isShowBrandRef: false});
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
    let { listData, selectedData, isShowBrandRef, pageIndex, pageCount } = this.state;
    let headerClass = `ref-window ${ isShowBrandRef ? 'active' : '' }`;
    let prevClass = `btn prev-btn ${pageIndex === 1 ? 'disable' : ''}`;
    let nextClass = `btn next-btn ${pageIndex === pageCount ? 'disable' : ''}`; 
    return (
      <div className={headerClass}>
        <NavBar
          mode="light"
          icon={<Icon type="cross" />}
          leftContent="关闭" 
          onLeftClick={ ()=> {
            this.closeRefWindow();
            return this.props.submitBrandRef(null, 'close') 
          }}
          rightContent={
            <div onClick={ () => {
              this.closeRefWindow();
              return this.props.submitBrandRef(selectedData,'open')
            }}>确定</div>
          }
        >设备品牌参照</NavBar>
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
                        }}>{''}</div>
                        <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#999', lineHeight: '30px'}}>{item.shortname}</div>
                        <div style={{ paddingLeft: '15px', fontSize: '12px', color: '#999', lineHeight: '30px'}}>{item.name}</div>
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

export default DevBrandRef;