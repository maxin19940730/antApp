import React from 'react';
import { connect } from 'dva'
import { Modal, List } from 'antd-mobile';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

const { Item } = List
class ItemDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    const { extra = '', label='', affter='', between='', extra2='' } = this.props
    console.log('extra',extra===null)
    return (
    <div>
      <Item extra={extra} onClick={(e)=>{
        this.setState({
          modal: true,
          extra,
          label,
        })
      }}>{label}</Item>
      {this.state.modal && <Modal
        visible={this.state.modal}
        transparent
        onClose={()=>{
          this.setState({
            modal: false
          })
        }}
        title={label}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <div style={{ height: 100, overflow: 'scroll' }}>
          <p>
            {extra}{between}{extra2}{affter}
          </p>
        </div>
      </Modal>
      }
    </div>);
  }
}

function mapStateToProps({ baseInfo }) {
  return { ...baseInfo }
}


export default connect(mapStateToProps)(ItemDetail);
