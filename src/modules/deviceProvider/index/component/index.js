import React from 'react';
import { NavBar, Icon, Grid } from 'antd-mobile';
import '../../../device/index/index.less';
import jinchang from 'Img/jinchang.png';
import deviceCheck from 'Img/deviceCheck.png';
import deviceService from 'Img/deviceService.png';
import deviceMaintenance from 'Img/deviceMaintenance.png';
import deviceRun from 'Img/deviceRun.png';


const data = [
  {
    icon: jinchang,
    text: '进场备货',
    link: '/deviceProvider/deviceApproachNoticeList'
  },{
    icon: deviceCheck,
    text: '设备整改',
    link: '/deviceProvider/deviceSupplierList'
  },{
    icon: deviceService,
    text: '设备维修',
    link: '/deviceProvider/deviceServiceList'
  },{
    icon: deviceMaintenance,
    text: '设备保养',
    link: '/deviceProvider/deviceMaintenanceList'
  },{
    icon: deviceRun,
    text: '设备运转',
    link: '/deviceProvider/deviceRunList'
  }];

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showStrewFlowers: false
    };
  }

  componentDidMount(){
    this.strewFlowers();
  }
// 返回
  callback = () => {
    this.context.router.goBack();
  }
// 路由跳转
  btnClick = (url) => {
    this.context.router.push(url);
  }
// 供应商首页雪花动画效果
  strewFlowers = () =>{
    var width, height, largeHeader, triangles, target, animateHeader = true;
    var circles = [];
    var that = this;
    var id = this.refs.canvas_strew.id;
    var canvas = document.getElementById(id);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');

    initHeader();
    addListeners();
 
    function initHeader() {
      width = window.innerWidth;
      height = window.innerHeight;
      target = {
        x: 0,
        y: height
      };
      // create particles
      for(var x = 0; x < width * 0.5; x++) {
        var c = new Circle();
        circles.push(c);
      }
      animate();
    }

    // Event handling
    function addListeners() {
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
    }

    function scrollCheck() {
      if(document.body.scrollTop > height) animateHeader = false;
      else animateHeader = true;
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      largeHeader.style.height = height + 'px';
      canvas.width = width;
      canvas.height = height;
    }

    function animate() {
      if(animateHeader) {
        ctx.clearRect(0, 0, width, height);
        for(var i in circles) {
          circles[i].draw();
        }
      }
      requestAnimationFrame(animate);
    }

    // Canvas manipulation
    function Circle() {
      var _this = this;

      // constructor
      (function() {
        _this.pos = {};
        init();
      })();

      function init() {
        _this.pos.x = Math.random() * width;
        _this.pos.y = height + Math.random() * 100;
        _this.alpha = 0.1 + Math.random() * 0.3;
        _this.scale = 0.1 + Math.random() * 0.3;
        _this.velocity = Math.random();
      }

      this.draw = function() {
        if(_this.alpha <= 0) {
          init();
        }
        _this.pos.y -= _this.velocity;
        _this.alpha -= 0.00005;
        ctx.beginPath();
        ctx.arc(_this.pos.x, _this.pos.y, _this.scale * 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(58, 193, 126,' + _this.alpha + ')';
        ctx.fill();
      };
    }
  }

  render() {
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          leftContent="返回" 
          onLeftClick={this.callback}
        >设备供应商管理</NavBar>
        <div className='zui-content index'>
        <canvas ref="canvas_strew" id="canvas_strew" style={{'position': 'absolute', 'top': '0px', 'left': '0px', 'bottom': '0', 'zIndex': '1'}}></canvas>
          <Grid data={data}
            columnNum={3}
            renderItem={dataItem => (
              <div style={{ padding: '12.5px' }} onClick={() => this.btnClick(dataItem.link)}>
                <img src={dataItem.icon} style={{ width: '12vw', height: '12vw' }} alt="" />
                <div style={{ color: '#333', fontSize: '14px', marginTop: '12px' }}>
                  <span>{dataItem.text}</span>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    );
  }
}

Index.contextTypes = {  
     router:React.PropTypes.object  
} 

export default  Index;
