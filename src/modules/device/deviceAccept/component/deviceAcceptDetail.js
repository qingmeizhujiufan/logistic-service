import React from 'react';
import { NavBar, Icon, Accordion, List, Tabs, Picker, Toast } from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
/* 引入自定义公共组件 */ 
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/info/detail/";
const ckitemUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/ckitem';
const featurerangeUrl = MODULE_URL.SHARE_BASEHOST + '/defdoc/manage/getbydefdoclistcode';
const featureUrl = MODULE_URL.DEVCONT_BASEHOST + '/spot/info/featureItem';

const tabs = [
  { title: '设备信息' },
  { title: '验收内容' },
  { title: '自定义内容' },
  { title: '保养信息' },
];

class DeviceAcceptDetail extends React.Component{ 
  constructor(props) {
    super(props); 
    this.state = {
      data: {},
      examDetails: [],
      defCheckContents: [],
      devItem: {},
      featureItems: [],
      billState: '',
      getLevelControlList: [],
      levelControl: '',
      makeFile: {
        attachesList: []
      },
      productFile: {
        attachesList: []
      },
      checkFile: {
        attachesList: []
      },
      recordFile: {
        attachesList: []
      },
      instructionFile: {
        attachesList: []
      }
    };
  }
  
  //首次渲染之前页面数据加载
  componentWillMount = () => {
    let pageUrl = findByIdUrl +this.props.params.id+'/1';
    ajax.getJSON(
      pageUrl,
      null,
      data => {
        var backData = data.backData;
        var examDetails = backData.examDetails;
        var featureItems = backData.featureItems;
        //获取验收内容
        const param = {
            billType: 'DEE02',
            contId: backData.contractId,
            devId: backData.devId,
        };
        ajax.getJSON(
          ckitemUrl,
          param,
          itemData => {
            var itemData = itemData.backData;
            if(itemData && itemData.length > 0) {
              let items = [];
              for(let i = 0; i < itemData.length; i++) {
                let o = {
                  detailId: (examDetails && examDetails.length > 0) ? examDetails[i].id : '',
                  checkItemId: itemData[i].id,
                  checkItemName: itemData[i].checkContent,
                  sourceType: examDetails[i].billSourceId,
                  result: (examDetails && examDetails.length > 0) ? examDetails[i].examResult : '1',
                  comment: (examDetails && examDetails.length > 0) ? examDetails[i].examDesc : '',
                }
                items.push(o);
              }
              this.setState({
                examDetails: items
              });
              this.getAttach(items,() => {
                this.setState({
                  examDetails: items
                });
              });
            }
          });       
        this.setState({
          data: backData,
          devItem: backData.devItem,
          defCheckContents : backData.defCheckContents,
          billState: backData.billState
        });
        console.log('featureItems == ', featureItems);
        this.loadFeatureList(featureItems);
      }
    );

    this.getLevelControlList();

    let makeFile = {
      attachesList: []
    },
    productFile = {
      attachesList: []
    },
    checkFile = {
      attachesList: []
    },
    recordFile = {
      attachesList : []
    },
    instructionFile = {
      attachesList : []
    };
    this.getAttachList(this.props.params.id, 
      [makeFile, productFile, checkFile, recordFile, instructionFile], 
      ()=>{
        this.setState({
        makeFile:makeFile,
        productFile:productFile,
        checkFile:checkFile,
        recordFile:recordFile,
        instructionFile:instructionFile
      });
    });
  } 

  //特征项
  loadFeatureList = (featureItems) =>{
    for (let i = 0; i< featureItems.length;i++) {
      let params_feature = {
        defdoclistCode: featureItems[i].featureCode
      };
      ajax.getJSON(
        featurerangeUrl, 
        params_feature, 
        (sub_data) => {
          let subBackData = sub_data.backData;
          let array = [];
          for (let j = 0; j < subBackData.length; j++){ 
             var o = { 
              value: subBackData[j].code,
              label: subBackData[j].name
            } 
            array.push(o);
          }
          featureItems[i].featureRangeList = array;

          this.setState({
            featureItems,
          });
      });
    }
    
    this.setState({
      featureItems,
    }, () => {
      this.calcLevel();
    });
    console.log('loadFeatureList backData == ', featureItems);
  } 

  //管控层级
  getLevelControlList = () =>{
    let paramFeature = {
      defdoclistCode: "19_device_102",
      condition: 'null'
    };
    ajax.getJSON(
      featurerangeUrl, 
      paramFeature, 
      (data) => {
      let backData = data.backData;
      console.log('levelControlList == ', backData)
      this.setState({
        levelControlList: backData
      });
    })
  }

  //计算管控层级
  calcLevel = () => {
    let { levelControlList, featureItems } = this.state;
    let code = featureItems[0].levelControl;
    for(var i = 1; i < featureItems.length; i++) {
      if(featureItems[i].levelControl && parseInt(code) < parseInt(featureItems[i].levelControl)) {
        code = featureItems[i].levelControl;
      }
    }
    levelControlList.map((item, index) => {
      if(item.code === code){
        this.setState({
          levelControl: item.name
        });
      }
    });
  }

  //获取验收详情附件
  getAttach = (itemDetails,callback) => {
      itemDetails.forEach(function(item) {
        item.attachesList = [];
        var params = {
          id: item.detailId,
          billType: 'DEE02',
          type: item.checkItemId
        };
         files.filesDownLoad(item, params,callback);
      });
  } 

  //获取附件列表
  getAttachList = (id, fileArray, callback) => {
    for (let i = 11; i <= 15; i++) {
        let param = {
          id: id,
          billType: 'DEN01',
          type: i,
        };
        if(i === 11){
          files.filesDownLoad(fileArray[0], param, callback); 
        }else if(i === 12){
          files.filesDownLoad(fileArray[1], param, callback);
        }else if(i === 13){
          files.filesDownLoad(fileArray[2], param, callback);
        }else if(i === 14){
          files.filesDownLoad(fileArray[3], param, callback);
        }else if(i === 15){
          files.filesDownLoad(fileArray[4], param, callback);
        }
    }; 
  } 

  //返回
  callback = () => {
    this.context.router.goBack();
  } 
 
  render() {
    let { data, featureItems, levelControl } = this.state;
    let devItem = this.state.devItem || {};
    let examDetails = this.state.examDetails || [];
    let defCheckContents = this.state.defCheckContents || [];
    let makeFile = this.state.makeFile || {};
    let productFile = this.state.productFile || {};
    let checkFile = this.state.checkFile || {};
    let recordFile = this.state.recordFile || {};
    let instructionFile = this.state.instructionFile || {};
    const AttachList1 = <YYShowAttachesList attachesList = {makeFile.attachesList} />;
    const AttachList2 = <YYShowAttachesList attachesList = {productFile.attachesList} />;
    const AttachList3 = <YYShowAttachesList attachesList = {checkFile.attachesList} />;
    const AttachList4 = <YYShowAttachesList attachesList = {recordFile.attachesList} />;
    const AttachList5 = <YYShowAttachesList attachesList = {instructionFile.attachesList} />;
    let baseInfoList = [{
      label: '制单人',
      value: data.examUserName
    }, {
      label: '验收日期',
      value: data.examTime
    }, {
      label: '项目名称',
      value: data.pjtName
    }, {
      label: '合同名称',
      value: data.contractName
    }, {
      label: '设备名称',
      value: data.devName
    }, {
      label: '设备管理编号',
      value: data.mgNo
    }, {
      label: '管控层级',
      value: levelControl
    }];                                                            
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >设备进场验收</NavBar>
        <div>
          <div className='zui-content  zui-scroll-wrapper'>
            <div className="zui-scroll">
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <YYBaseInfo baseInfoList={baseInfoList} />
              </Accordion.Panel>
            </Accordion>
              <div className='zui-pane'>
                <h2 className='zui-pane-title'>特征值信息</h2>
              </div>
              {
                featureItems.map(function(item, index){
                  return <div key = {index}>
                            <h4 style={{padding: '5px 0 5px 15px',fontStyle: 'italic',margin: '5px 0'}}>{ index + 1 }</h4>
                            <List className="my-list">
                              <List.Item extra={item.featureName}>特征项</List.Item>
                              <Picker  
                                data={item.featureRangeList} 
                                cols={1}
                                extra='无'
                                value= {[item.featureCodeValue]}
                              >
                               <List.Item arrow="horizontal">特征值范围</List.Item>
                              </Picker>
                              {
                                (item.featureIsEmpty ? <List.Item extra={item.featureValue}>特征值</List.Item> : null)
                              }
                            </List>
                         </div>
                })
              }
              <div style={{marginTop: '10px'}}>
                  <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab);}}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}>
                      <div>
                      <List className="my-list">
                        <List.Item extra={devItem.sdevName}>设备名称</List.Item>
                        <List.Item extra={devItem.sdevModel}>设备型号</List.Item>
                        <List.Item extra={devItem.mainParam}>主要参数</List.Item>
                        <List.Item extra={devItem.power}>功率</List.Item>
                        <List.Item extra={devItem.prodTime}>出厂日期</List.Item>
                        <List.Item extra={devItem.makerName}>品牌</List.Item>
                        <List.Item extra={devItem.factoryNo}>出厂编号</List.Item>
                        <List.Item extra={devItem.filNo}>备案编号</List.Item>
                        <List.Item extra={devItem.equityComp}>产权单位</List.Item>
                        <List.Item extra={devItem.equityType}>产权性质</List.Item>
                        <List.Item extra={devItem.memo}>备注</List.Item>
                      </List>
                      <div className='zui-pane'>
                        <h2 className='zui-pane-title'>设备附件管理</h2>
                      </div>
                      <List className="my-list">
                        <List.Item extra={AttachList1}>制造许可证</List.Item>
                        <List.Item extra={AttachList2}>产品合格证</List.Item>
                        <List.Item extra={AttachList3}>制造监督检验证明</List.Item>
                        <List.Item extra={AttachList4}>备案证明</List.Item>
                        <List.Item extra={AttachList5}>使用说明书</List.Item>
                      </List>
                      </div>
                      {                           
                        (examDetails ? examDetails : []).map(function(subItem, subIndex){
                            return  <div key={subIndex} className="content-details index-list">
                                      <div className="wrap-index">
                                        <p className="index-text">
                                          <span className="iconfont icon-project text-green"></span>
                                          <span>{subItem.checkItemName}</span>
                                        </p>
                                        <div className="index-detail">
                                          <p className="text-green">检查详情</p>
                                          <div className="index-detail-comment">{subItem.comment}</div>
                                          <YYShowAttachesList attachesList = {subItem.attachesList} />
                                        </div>
                                        <div className="btn-group">
                                          <div className={'btn-circle ' + (subItem.result === 1 ? '' : 'zui-hidden')} data-bind="visible: result == 1"><span className="iconfont icon-correct text-green"></span>合格</div>
                                          <div className={'btn-circle ' + (subItem.result !== 1 ? '' : 'zui-hidden')}><span className="iconfont icon-error text-red"></span>不合格</div>
                                        </div>
                                      </div>
                                    </div>
                                })
                      }
                      {
                        (defCheckContents ? defCheckContents : []).map(function(subItem, subIndex){
                            return  <div key={subIndex} className="content-details index-list">
                                      <div className="wrap-index">
                                        <p className="index-text">
                                          <span className="iconfont icon-project text-green"></span>
                                          <span>{subItem.checkContent}</span>
                                        </p>
                                        <div className="index-detail">
                                          <p className="text-green">检查详情</p>
                                          <div className="index-detail-comment">{subItem.examDesc}</div>
                                        </div>
                                        <div className="btn-group">
                                          <div className={'btn-circle ' + (subItem.examResult === 1 ? '' : 'zui-hidden')} data-bind="visible: result == 1"><span className="iconfont icon-correct text-green"></span>合格</div>
                                          <div className={'btn-circle ' + (subItem.examResult !== 1 ? '' : 'zui-hidden')}><span className="iconfont icon-error text-red"></span>不合格</div>
                                        </div>
                                      </div>
                                    </div>
                                })
                      }
                      <List className="my-list">
                        <List.Item extra={data.examUserName}>验收人员</List.Item>
                        <List.Item extra={data.respUserName}>责任人</List.Item>
                        <List.Item extra={data.matCircle}>保养周期</List.Item>
                        <List.Item extra={data.matTime}>保养台时</List.Item>
                        <List.Item extra={data.matAlmCircle}>保养预警周期</List.Item>
                        <List.Item extra={data.matAlmTime}>保养预警台时</List.Item>
                      </List>
                  </Tabs>
              </div>
            </div>
          </div> 
        </div>
      </div>
    );
  }
};

DeviceAcceptDetail.contextTypes = {  
     router:React.PropTypes.object  
} 

export default DeviceAcceptDetail;
