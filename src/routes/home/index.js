import React from 'react'
import { connect } from 'dva'
import { NavLink } from 'dva/router'
import { Modal, Icon, List, Grid, Card, NavBar, WingBlank, WhiteSpace } from 'antd-mobile';
import styles from '../../router.less'
import userPng from './user.png'
import png1 from './1.png'
import png2 from './2.png'
import png3 from './3.png'
import png4 from './4.png'
import png5 from './5.png'
import BScroll from 'better-scroll'
const Item = List.Item

const data = [
  {icon: <img alt='' src={png1} className="am-icon am-icon-lg" />, text: '基本信息'},
  {icon: <img alt='' src={png2} className="am-icon am-icon-lg" />, text: '儿童保健'},
  {icon: <img alt='' src={png3} className="am-icon am-icon-lg" />, text: '妇女保健'},
  {icon: <img alt='' src={png4} className="am-icon am-icon-lg" />, text: '老年人管理'},
  {icon: <img alt='' src={png5} className="am-icon am-icon-lg" />, text: '慢病管理'},
]

const data2 = [
  {icon: <Icon type="jingshenbing-" color='#1abc9c' size="lg"/>, text: '精神病患者管理'},
  {icon: <Icon type="transfusion" color='#1abc9c' size="lg"/>, text: '糖尿病患者管理'},
  {icon: <Icon type="feiai" color='#1abc9c' size="lg"/>, text: '结核病患者管理'},
  {icon: <Icon type="icon-" color='#1abc9c' size="lg"/>, text: '高血压者管理'},
]
class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      scroller: '',
      user: sessionStorage.getItem('user') && sessionStorage.getItem('user')!=='undefined' && sessionStorage.getItem('user')!=='null' ? JSON.parse(sessionStorage.getItem('user')) : {}
    }
  }

  componentDidMount=()=>{
    var bScroll = this.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      this.setState({
        scroller: new BScroll(this.refs.home, {
          click: true,
          scrollbar: {
            fade: true,
            interactive: false
          }
        })
      }, function () {
        bScroll = bScroll || this.state.scroller
      });
    }
  }

  componentDidUpdate=()=>{
    var bScroll = this.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      this.setState({
        scroller: new BScroll(this.refs.home, {
          click: true,
          scrollbar: {
            fade: true,
            interactive: false
          }
        })
      }, function () {
        bScroll = bScroll || this.state.scroller
      });
    }
  }

  gridClick=(grid,index)=>{
    switch(index){
      case 0: 
        this.props.history.push('/baseInfoList')
      break;
      case 4: 
        this.setState({
          modal: true
        })
      break;
      default: return
    }
    
  }

  modalGridClick=(grid,index)=>{
    switch(index){
      case 0: 
        
      break;
      case 3: 
        this.props.history.push('/hypertensionBaseList')
      break;
      default: return
    }
    
  }

  render() {
    const { user = {} } = this.state
    return <div>
      <NavBar
        className={styles.navBar}
        >
        健康档案管理系统
      </NavBar>
      <div ref="home" className={styles.home}>
        <WingBlank>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="&nbsp;个人信息"
              thumb={<Icon type="gerenzhongxinwoderenwubiaozhuntouxianxing" size='sm' color='#1abc9c' />}
            />
            <Card.Body>
            <Item 
            className={styles.user}
            align="top"
            thumb={userPng}
            multipleLine>
              <div className={styles.message}>{user.clientname}</div>
              <WhiteSpace />
              <div className={styles.message}>{user.rolename}</div>
              <WhiteSpace />
              <div className={styles.message}>{user.departname}</div>
            </Item>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="&nbsp;待办事项"
              thumb={<Icon type="tixing" size='sm' color='#1abc9c' />}
            />
            <Card.Body>
              <Item extra="处理>" className={styles.backlog}>1. 您有随访记录需要处理；</Item>
              <Item extra="处理>" className={styles.backlog}>2. 您有随访记录需要处理；</Item>
              <Item extra="处理>" className={styles.backlog}>3. 您有随访记录需要处理；</Item>
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header
              title="&nbsp;我的应用"
              thumb={<Icon type="caidan" size="xxs" color='#1abc9c' />}
            />
            <Card.Body>
              <Grid columnNum={3} onClick={this.gridClick} data={data} activeStyle={false} hasLine={false} />
            </Card.Body>
          </Card>
          <WhiteSpace size="lg" />
        </WingBlank>
      </div>
      <div className={styles.tabPanel}>
        <div className={styles.tabPanelItem}>
          <NavLink exact to="/home" activeClassName="active">
          <div><Icon type="home" size='md' color='#1abc9c' /></div>
          首页
          </NavLink>
        </div>
        <div className={styles.tabPanelItem}>
          <NavLink exact to="/home" activeClassName="active">
          <div><Icon type="xiaoxi" size='md'/></div>消息</NavLink>
        </div>
        <div className={styles.tabPanelItem}>
          <NavLink exact to="/" activeClassName="active">
          <div><Icon type="shezhi" size='md' /></div>
          退出
          </NavLink>
        </div>
      </div>
      <Modal
        visible={this.state.modal}
        transparent
        onClose={()=>this.setState({
          modal: false
        })}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        <Grid className={styles.modalGrid} columnNum={2} onClick={this.modalGridClick} data={data2} activeStyle={false} hasLine={false} />
      </Modal>
    </div>
  }
}

function mapStateToProps({home}) {
  return { ...home }
}

export default connect(mapStateToProps)(Home)
