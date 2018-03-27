import React from 'react';
import { NavBar, Icon, Accordion, List, DatePicker, TextareaItem, InputItem} from 'antd-mobile';
import {MODULE_URL} from 'RestUrl';
import authToken from 'Utils/authToken';
import ajax from 'Utils/ajax';
import '../deviceApproachNotice.less';

const pageUrl = MODULE_URL.DEVCONT_BASEHOST + "/deviceleasecontract/findById";
const billSaveUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/commit";
const submitUrl = MODULE_URL.DEVCONT_BASEHOST + "/spot/enternotice/doSubmit";
const loginProjectUserUrl = MODULE_URL.DEVCONT_BASEHOST + "/loginContext/getProjectUserInfo";
const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

class deviceApproachNoticeAdd extends React.Component{  
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      time: {
        reportTime: now,   
      }, 
      devicelist: [],
      billInfo:{},
      devList:[],
      devInfo:{},
      childDetail:[],  
      submitParam:{},
      projectInfo:{},
      value:'',
      memo:''
    };
  }

  //初次渲染之前请求数据
  componentWillMount() {
    console.log(this.props.params)
    let param = {
      id: this.props.params.id, 
    };
    ajax.getJSON(
      pageUrl,
      param,
      data => {
        this.setState({
          data: data.backData,
          childDetail:data.backData.childrenDetail
        });  
      } 
    );
     console.log('this data == ', this.state.data);
  }

  //完成渲染后（真实Dom）调用
  componentDidMount() {
    this.getProject(); 
  }

  //获取项目信息
  getProject = () => {
    const param = {
      companyId: authToken.getOrgaId(),
      userId: authToken.getUserId()
    };
    ajax.getJSON(
      loginProjectUserUrl,
      param,
      (data) => {
        let projectInfo = {
          id: data.backData.project.projectId,
          name: data.backData.project.projectName,
          address: data.backData.project.address,
          mobile: data.backData.user.userMobile
        };
        this.setState({
          projectInfo,
        });
      }
    );
  }

  //返回
  callback = () => {
    this.context.router.goBack();
  }

  //提交数据
  saveData = (data,childDetail) => { 
    console.log(data);
    console.log(childDetail); 
    let billInfo = this.state.billInfo;
    let time = this.state.time;
    billInfo.billCode = data.billCode;
    billInfo.contractName = data.contName;
    billInfo.contractId = data.id;
    billInfo.supplierName = data.supplierName;
    billInfo.supplierId = data.supplierId;
    billInfo.creatorid = authToken.getUserId(),
    billInfo.creator = authToken.getUserName()
    billInfo.createDate = new Date().getTime();
    billInfo.companyId = authToken.getOrgaId();
    billInfo.createtime = new Date().getTime();
    billInfo.supplierId = data.supplierId;
    billInfo.supplierName = data.supplierName;
    billInfo.contactName =authToken.getStaffName();
    billInfo.contactId = authToken.getStaffId();
    billInfo.contactPhone = this.state.projectInfo.mobile;
    billInfo.projectId = this.state.projectInfo.id;
    billInfo.projectName = this.state.projectInfo.name;
    billInfo.projectAddr = this.state.projectInfo.address;
     
      let devInfo = this.state.devInfo;
      let devList = this.state.devList;
      for(var i = 0; i < childDetail.length; i++) {  
        if(this.props.params.devid == childDetail[i].dictDevId) {
          devInfo.devName = childDetail[i].devName;
          devInfo.devId = childDetail[i].dictDevId;
          devInfo.devNo = childDetail[i].devNo;
          devInfo.devModel = childDetail[i].devSpec;
          devInfo.enterDate = new Date(time.reportTime).getTime();
          devInfo.requirement = this.state.value;
          devInfo.memo = this.state.memo;
          devInfo.contractName = data.contName;
          devInfo.maker = childDetail[i].devBrand;
          devInfo.makerName = childDetail[i].devBrandName;
          devInfo.fromChildId = childDetail[i].id;
          devInfo.contType = childDetail[i].billSourceType;
          devInfo.devCatId = childDetail[i].catId;  
          devList.push(devInfo);
        }
      } 
    billInfo.devList = devList;
    console.log(billInfo);
    ajax.postJSON(
        billSaveUrl, 
        JSON.stringify(billInfo),
        data => {
            if(data.success) {
              console.log(data); 
              let submitParam = this.state.submitParam;
              submitParam.bill = data.backData;
              submitParam.billCode = data.backData.billCode;
              submitParam.businessKey = data.backData.id;
              submitParam.cbiztypeId = '1';
              submitParam.formurl = MODULE_URL.DEVCONT_BASEHOST + "apps/compactCloud/#/deviceen/edit/40283f8157a401a00157a404e6a70000";
              submitParam.procInstName = "进场通知 [" + data.backData.billCode + "] 进场通知单号：" + data.backData.billCode;
              submitParam.userId = authToken.getUserId();
              submitParam.billtypeId = "DEN01";
              console.log(submitParam);
              ajax.postJSON(
                submitUrl, 
                JSON.stringify(submitParam),
                data => {
                    if(data.success) {
                      console.log(data);
                      this.context.router.push('/device/deviceApproachNoticeList');
                    } 
                  } 
                );
            } 
          } 
        );
  }

  render() { 
     let { value, memo, time, projectInfo, data, childDetail } = this.state;   
     let devicelist = data.childrenDetail || []; 
     let devid = this.props.params.devid;
    return (
      <div>
        <NavBar
            icon={<Icon type="left" />}
            leftContent="返回" 
            mode="light" 
            onLeftClick={this.callback} 
            rightContent={
            <div onClick={ () => {
                this.saveData(data,childDetail); 
              }}>提交</div>
            }
          >设备进场</NavBar>
        <div className='zui-content zui-scroll-wrapper'>
          <div className="zui-scroll"> 
            <Accordion defaultActiveKey="0" className="my-accordion" onChange={this.onChange}>
              <Accordion.Panel header="基本信息">
                <List className="my-list">
                  <List.Item extra={data.contName} thumb={<span className="icon-device icon-device-contract"></span>}>合同名称</List.Item>
                  <List.Item extra={data.insDisUnitName} thumb={<span className="icon-device icon-device-providerName"></span>}>出租单位</List.Item>
                  <List.Item extra={
                    <input type='text' size='10' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={authToken.getStaffName()}></input> 
                          }
                  thumb={<span className="icon-device icon-device-projectLink"></span>}>
                  项目联系人</List.Item>
                  <List.Item extra={data.projectName} thumb={<span className="icon-device icon-device-project"></span>}>项目名称</List.Item>
                  <List.Item extra={
                     <input type='text' size='15' style={{textAlign:'right',backgroundColor:'#f0f0f0',border:'0px'}} placeholder={projectInfo.mobile}></input> 
                          }
                  thumb={<span className="icon-device icon-device-linkPhone"></span>}>
                  联系电话</List.Item>
                  <List.Item extra={projectInfo.address} thumb={<span className="icon-device icon-device-project"></span>}>项目地址</List.Item> 
                </List>
              </Accordion.Panel>
            </Accordion>
            <div className='zui-pane'>
              <h2 className='zui-pane-title'>进场详情</h2>
            </div>
            <List className="my-list" style={{marginTop:'10px'}}>
                  <div>
                    {
                      devicelist.map(function(datad,index){
                        return(
                        <List className={devid !== datad.dictDevId ?'statehide':''} key={index} style={{marginTop:'10px'}}>
                          <List.Item extra={datad.devName} thumb={<span className="icon-device icon-device-equipment"></span>}>设备名称</List.Item>
                          <List.Item extra={datad.devSpec} thumb={<span className="icon-device icon-device-equipmentType"></span>}>设备型号</List.Item> 
                        </List>  
                      )}) 
                    }
                  </div>  
                  <List.Item extra={data.contName} thumb={<span className="icon-device icon-device-providerName"></span>}>来源</List.Item>  
                   <DatePicker
                    mode="date"
                    title=""
                    extra="请选择"
                    value={time.reportTime}
                    onChange={
                      (date) => {
                        time.reportTime = date;
                        this.setState({ time:  time});
                      }
                    }
                   >
                     <List.Item arrow="horizontal" thumb={<span className="icon-device icon-device-inDate"></span>}>进场时间</List.Item>
                    </DatePicker>
                    <List.Item >进场要求
                     <TextareaItem  
                        autoHeight
                        labelNumber={5}
                        placeholder='请填写进场要求'
                        onChange={
                          (value) => {  
                            this.setState({ value:  value});
                          }
                        }
                     />
                    </List.Item>
                    <List.Item >备注
                     <TextareaItem  
                        autoHeight
                        labelNumber={5}
                        placeholder='请填写备注'
                        onChange={
                          (memo) => {  
                            this.setState({ memo:  memo});
                          }
                        }
                     />
                    </List.Item>  
            </List>
          </div>
        </div>
      </div>
    );
  }
};

deviceApproachNoticeAdd.contextTypes = {  
     router:React.PropTypes.object  
}  
export default deviceApproachNoticeAdd;
