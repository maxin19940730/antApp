import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import BScroll from 'better-scroll'
import styles from '../../router.less'
import { routerRedux } from 'dva/router'
import {
  List,
  Pagination,
  Icon,
  Button,
  ActivityIndicator,
  ActionSheet,
  NavBar,
  Modal,
} from 'antd-mobile'
const Item = List.Item
const locale = {
  prevText: '上一页',
  nextText: '下一页',
};


var that
class HypertensionList extends React.Component {
  constructor() {
    super()
    that = this
    this.state = {
      scroller: '',
      modalVisible: false,
      selectId: '',
      open: true,
      animating: false,
      height: Number(document.documentElement.clientHeight)-136+'px'
    }
  }
  componentDidMount(){
    this.props.dispatch({
      type: 'hypertension/getHList',
      params: {
        page: 1,
      }
    })
    var bScroll = that.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      that.setState({
        scroller: new BScroll(that.refs.hypertensionListWrapper, {
          click: true,
          scrollbar: {
            fade: true,
            interactive: false
          }
        })
      }, function () {
        bScroll = bScroll || that.state.scroller
      });
    }
  }

  showModal=(id)=>{
    this.setState({
      modalVisible: true,
      selectId: id,
    })
  }
  onClose=(prams)=>{
    this.setState({
      modalVisible: false
    })
  }
  showActionSheet = (visitId) => {
    this.setState({visitId},()=>{
    const BUTTONS = ['查看', '修改', '删除', '取消'];
    ActionSheet.showActionSheetWithOptions({
      options: BUTTONS,
      cancelButtonIndex: BUTTONS.length - 1,
      destructiveButtonIndex: BUTTONS.length - 2,
      maskClosable: true,
      'data-seed': 'logId',
    },
    (buttonIndex) => {
      switch(buttonIndex){
        case 0: 
        this.props.dispatch(
          routerRedux.push({
            pathname: '/hypertensionDetail',
            query: {
              visitId,
            },
          })
        )
        break;
        case 1:
        this.props.dispatch(
          routerRedux.push({
            pathname: '/hypertensionFrom',
            query: {
              visitId,
            },
          })
        )
        break;
        case 2: 
        this.setState({
          delModal: true
        })
        break;
        default: break;
      }
    });
  })
  }

  pageChange=(current)=>{
    const { pagination = {} } = this.props
    this.props.dispatch({
      type: 'hypertension/getHList',
      params: {
        page: current ? current: (pagination.current || 1),
      }
    })
  }
  
  del=()=>{
    this.props.dispatch({
      type: 'hypertension/del',
      payload:{
        visitId: this.state.visitId
      }
    })
    this.setState({
      delModal: false,
    })
  }

  render() {
    const { Hlist = [] } = this.props
    var hypertensionLists = Hlist.length ? Hlist.map((item, index) => (
      <Item 
        className={styles.hypertensionList}
        key={index}
        align="top"
        thumb={<Icon type="icon-" size='lg' color="#1abc9c"/>}
        extra={<Icon onClick={()=>this.showActionSheet(item.visitId)} type="ellipsis" />}
        multipleLine>
        <div className={'message'}>随访日期：{item.visitDate && moment(item.visitDate).format('YYYY-MM-DD')}</div>
        <div className={'message'}>随访方式: {item.visitWay}</div>
        <div className={'message'}>随访医生: {item.doctor}</div>
      </Item>
    )) : <div className={styles.noData}>暂无数据</div>
    return <div className={styles.home}>
      <Modal
        visible={this.state.delModal}
        transparent
        maskClosable={false}
        onClose={()=>this.setState({delModal: false})}
        title="确定删除？"
        footer={[
          { text: '取消', onPress: () => { this.setState({delModal: false})}},
          { text: '确认', onPress: this.del }
        ]}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      />
      {this.props.loading &&
      <ActivityIndicator
        toast
        text="Loading..."
        animating={true}
      />}
      <NavBar
        className={styles.navBar}
        icon={<Icon type="left" color='#fff'/>}
        onLeftClick={()=>{
          this.props.history.push('/hypertensionBaseList')
        }}
        >
        {this.props.name}的随访记录
      </NavBar>
      <div ref="hypertensionListWrapper"
        className={styles.hypertensionListWrapper}
        style={{height: this.state.height}}
        >
        <div>
          { this.props.listLoading ? 
          <div style={{justifyContent: 'center',display: 'flex'}}>
            <ActivityIndicator
              size='large'
            />
          </div> :
          <List>
            {hypertensionLists}
            <Pagination locale={locale} onChange={(e)=>this.pageChange(e)} {...this.props.pagination}/>
          </List>
          }
        </div>
      </div>
      <Button className={styles.createFrom} onClick={()=>this.props.dispatch(
        routerRedux.push({
          pathname: '/hypertensionFrom',
          query: null,
        })
      )}>创建随访服务记录</Button>
    </div>
  }
}

function mapStateToProps({ hypertension, loading }) {
  return { 
    ...hypertension,
    listLoading: loading.effects['hypertension/getHList'],
    loading: loading.effects['hypertension/del'] || loading.effects['hypertension/getHList']
  }
}

export default connect(mapStateToProps)(HypertensionList)
