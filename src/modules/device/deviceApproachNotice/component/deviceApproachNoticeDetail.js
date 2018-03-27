import React from 'react';
import { NavBar, Icon, Button , Accordion, List, Modal, Toast } from 'antd-mobile';
import '../deviceApproachNotice.less';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import files from 'Utils/files';
/* 引入自定义公共组件 */
import YYBaseInfo from 'Comps/yyjzMobileComponents/yyBaseInfo';
import YYShowAttachesList from 'Comps/yyjzMobileComponents/yyShowAttachesList';

const findByIdUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/detail/";
const comeInUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/accessenter";
const rejectUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/compositeenter";

class DeviceApproachNoticeDetail extends React.Component{ 
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      devList: [],
      devItem: {},
      billState: '',
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

  //初次渲染之前请求数据
  componentWillMount = () => {
    let pageUrl = findByIdUrl+this.props.params.id+'/0'; 
    ajax.getJSON(
      pageUrl,
      null,
      data => {
        var backData = data.backData;
        this.setState({
          data: backData,
          devList: backData.devList,
          devItem: backData.devItem,
          billState: backData.billState
        });
      }
    ) 

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
    console.log(this.state.makeFile)
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

  //拒绝进场
  rejectComeIn = (id) => {
    const alert = Modal.alert; 
    const content = alert('如果您拒绝的话，设备供应商将收到您的拒绝通知，并重新填写设备详细信息再次提交，请您确认。', '拒绝此设备进场？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => {
          // const param = {
          //   id: id
          // }
          ajax.postJSON(
            rejectUrl,
            id,
            (data) =>{
              console.log('rejectComeIn==',data);Toast.fail('reject!', 1);
              this.context.router.goBack();
            });
       } 
      },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      content.close();
    }, 50000);
  } 

  //同意进场
  confirmComeIn = (id) => {
    const alert = Modal.alert;
    console.log(this.state.devList[0].enterDate)
    const content = alert('如果您同意的话，设备供应商将在日期'+'['+this.state.devList[0].enterDate+']'+'将符合此单据描述的设备详情的设备'+'['+this.state.devList[0].devName+']'+'进场，请您确认。', '同意此设备进场？', [
      { text: '取消', onPress: () => console.log('cancel'), style: 'default' },
      { text: '确定', onPress: () => {
          // const param = {
          //   id: id
          // }
          ajax.postJSON(
            comeInUrl,
            id,
            (data) =>{
              console.log('confirmComeIn==',data);
              this.context.router.goBack();
            }
            );
       } 
      },
    ]);
    setTimeout(() => {
      // 可以调用close方法以在外部close
      console.log('auto close');
      content.close();
    }, 50000);
  } 

  render() {
    let data = this.state.data;
    let devList = this.state.devList || [];
    let devItem = this.state.devItem || {};
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
      label: '单据编码',
      value: data.billCode
    }, {
      label: '项目名称',
      value: data.projectName
    }, {
      label: '项目地址',
      value: data.projectAddr
    }, {
      label: '项目联系人',
      value: data.contactName
    }, {
      label: '联系电话',
      value: data.contactPhone
    }, {
      label: '合同名称',
      value: data.contractName
    }, {
      label: '出租单位',
      value: data.supplierName
    }];                                                           
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback}
          >进场确认单</NavBar>
        <div>
          <div className='zui-content zui-scroll-wrapper'>
            <div className="zui-scroll">
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                <Accordion.Panel header="基本信息">
                   <YYBaseInfo baseInfoList={baseInfoList} />
                </Accordion.Panel>
              </Accordion> 
              <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
                {
                  devList.map((item, index) =>
                        <Accordion.Panel key={index} header="进场要求">
                                <List className="my-list">
                                  <List.Item extra={item.devName}>设备名称</List.Item>
                                  <List.Item extra={item.devModel}>设备型号</List.Item>
                                  <List.Item extra={item.enterDate}>进场时间</List.Item>
                                  <List.Item extra={item.contractName}>来源</List.Item>
                                  <List.Item extra={item.requirement}>要求</List.Item>
                                  <List.Item extra={item.memo}>备注</List.Item>
                                </List>
                        </Accordion.Panel>
                  )
                }
              </Accordion>
              {
                (this.state.billState === 46 || this.state.billState === 47) ? 
                  (
                    <div>
                      <div className='zui-pane'>
                        <h2 className='zui-pane-title'>设备详情</h2>
                      </div>
                      <List className="my-list">
                        <List.Item extra={devItem.sdevName}>设备名称</List.Item>
                        <List.Item extra={devItem.sdevModel}>设备型号</List.Item>
                        <List.Item extra={devItem.makerName}>品牌</List.Item>
                        <List.Item extra={devItem.mainParam}>主要参数</List.Item>
                        <List.Item extra={devItem.power}>功率</List.Item>
                        <List.Item extra={devItem.prodTime}>出厂日期</List.Item>
                        <List.Item extra={devItem.factoryNo}>出厂编号</List.Item>
                        <List.Item extra={devItem.filNo}>备案编号</List.Item>
                        <List.Item extra={devItem.equityType}>产权单位</List.Item>
                        <List.Item extra={devItem.factoryNo}>产权性质</List.Item>
                      </List>
                    </div>
                  )  : null
                
              }
              {
                (this.state.billState === 46 || this.state.billState === 47) ? 
                  (
                    <div>
                      <div className='zui-pane'>
                        <h2 className='zui-pane-title'>设备附件</h2>
                      </div>
                      <List className="my-list">
                        <List.Item extra={AttachList1}>制造许可证</List.Item>
                        <List.Item extra={AttachList2}>产品合格证</List.Item>
                        <List.Item extra={AttachList3}>制造监督检验证明</List.Item>
                        <List.Item extra={AttachList4}>备案证明</List.Item>
                        <List.Item extra={AttachList5}>使用说明</List.Item>
                      </List>
                    </div>
                  )  : null
                
              }
              {
                (this.state.billState === 46) ? 
                (
                <div style={{width:'100%',height:"40px"}}>
                  <div className="footer-btn-group" >
                    <div  className="left-btn" onClick = {this.rejectComeIn.bind(this,data.id)}>驳回</div>
                    <div  className="right-btn" icon={<Icon type="check" />} onClick = {this.confirmComeIn.bind(this,data.id)}>确认</div>
                  </div>
                </div>
                ) : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
};

DeviceApproachNoticeDetail.contextTypes = {  
     router:React.PropTypes.object  
} 
export default DeviceApproachNoticeDetail;
