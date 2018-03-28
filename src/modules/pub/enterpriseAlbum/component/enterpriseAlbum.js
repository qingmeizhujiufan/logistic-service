import React from 'react';
import { NavBar, Icon, Carousel, WhiteSpace, WingBlank } from 'antd-mobile';
import '../enterpriseAlbum.less';

class EnterpriseAlbum extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
          data: ['1', '2', '3'],
          imgHeight: 176,
          slideIndex: 0,
        };
    }
  
    componentDidMount() {
      // simulate img loading
      setTimeout(() => {
        this.setState({
          data: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
        });
      }, 100);
    }

    //返回
    callback = () => {
      this.context.router.goBack();
    }

    render() {

        return (
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              leftContent="返回" 
              onLeftClick={this.callback}
            >企业相册</NavBar>
            <div className='zui-content index zui-scroll-wrapper'>
              <div className="zui-scroll">
                  <div className="sub-title">Space</div>
                  <Carousel className="space-carousel"
                    frameOverflow="visible"
                    cellSpacing={10}
                    slideWidth={0.8}
                    autoplay
                    infinite
                    beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                    afterChange={index => this.setState({ slideIndex: index })}
                  >
                    {this.state.data.map((val, index) => (
                      <a
                        key={val}
                        href="http://www.alipay.com"
                        style={{
                          display: 'block',
                          position: 'relative',
                          top: this.state.slideIndex === index ? -10 : 0,
                          height: this.state.imgHeight,
                          boxShadow: '2px 1px 1px rgba(0, 0, 0, 0.2)',
                        }}
                      >
                        <img
                          src={`https://zos.alipayobjects.com/rmsportal/${val}.png`}
                          alt=""
                          style={{ width: '100%', verticalAlign: 'top' }}
                          onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'));
                            this.setState({ imgHeight: 'auto' });
                          }}
                        />
                      </a>
                    ))}
                  </Carousel>
                        </div>   
                      </div>
                    </div>
                  );
    }
}

EnterpriseAlbum.contextTypes = {  
    router: React.PropTypes.object  
} 

export default  EnterpriseAlbum;
