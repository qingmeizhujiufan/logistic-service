import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Flex } from 'antd-mobile';
import './index.less';

class CardList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          tabIndex: this.props.data.tabIndex
        };
    }
  
    componentDidMount() {
    }

    btnClick = (url) => {
      this.context.router.push(url);
    }

    changeTab = (index) => {
      console.log('index === ', index);
      this.setState({
        tabIndex: index
      });
    }

    showTab = () => {
      const { tabIndex } = this.state;
      const { data } = this.props;
      if(data.tabs){
        return (
          <div className="tab-button-group">
          {
            data.tabs.map((item, index) => {
              const _class = `tab-button ${tabIndex === (index + 1) ? 'active' : ''}`;
              return (
                <span key={index} className={_class} onClick={() => this.changeTab(index + 1)}>{item.label}</span>
              )
            })
          }
          </div>
        )
      }
    }

    render() {
      const { tabIndex } = this.state;
      const { data } = this.props;

      return (
        <div>  
          {this.showTab()}
          <Flex justify="between" style={{marginTop: 20}}>
            <h1 style={{fontSize: 20}}>{data.title}</h1>
            <span style={{fontSize: 14, color: '#888'}}>企业官网-></span>
          </Flex>
          <ul className="zui-list-unstyled card-list">
            {
              data.tabContent.map((item, index) => {
                return (
                  <li key={index}>
                    <Link to={item.path + tabIndex}>
                      <div className="wrap-img">
                        <img src={item.preview} />
                      </div>
                      <div className="title">{item.title}</div>
                      <div className="desc">{item.desc}</div>
                    </Link>
                  </li>
                )
              })
            }
          </ul>
        </div>
      );
    }
}


CardList.contextTypes = {  
  router: React.PropTypes.object,
  // value: PropTypes.number.isRequired,
  // onIncreaseClick: PropTypes.func.isRequired
} 

export default CardList;
