import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import BScroll from 'better-scroll'
import styles from '../../router.less'
import listThumb from './listThumb.png'
import { routerRedux } from 'dva/router'
import FilterFrom from './FilterFrom'

import {
  List,
  Flex,
  SearchBar,
  Pagination,
  Icon,
  Button,
  ActivityIndicator,
  ActionSheet,
  NavBar,
  Popover,
  Modal,
  Drawer,
} from 'antd-mobile'
const Item = List.Item
const PopoverItem = Popover.Item;
const locale = {
  prevText: '上一页',
  nextText: '下一页',
};


var that
class Home extends React.Component {
  constructor() {
    super()
    that = this
    this.state = {
      scroller: '',
      modalVisible: false,
      selectId: '',
      open: true,
      searchValue: '',
      height: Number(document.documentElement.clientHeight)-136+'px'
    }
  }

  componentWillMount= () => {
    this.props.dispatch({
      type: 'baseInfo/getList',
      params: {
        page: 1,
        limit: 10,
      }
    })
  }
  componentDidMount(){
    var bScroll = that.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      that.setState({
        scroller: new BScroll(that.refs.baseInfoListWrapper, {
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

  gotoDetail(item) {
    this.props.dispatch({
      type: "appState/add"
    })
    this.props.history.push('/detail/' + item.id)
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
  showActionSheet = (ehrId) => {
    this.setState({ehrId},()=>{
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
              pathname: '/baseInfoDetail',
              query: {
                ehrId
              },
            })
          )
          break;
          case 1:
          this.props.dispatch(
            routerRedux.push({
              pathname: '/baseInfoFrom',
              query: {
                ehrId
              },
            })
          )
          break;
          case 2:
          this.setState({
            modal: true
          })
          break;
          default: break;
        }
      });
    })
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  onFilterFromClose = ()=>{
    this.setState({
      filterOpen: false
    })
  }

  getFilterValue = (filterValue) => {
    this.setState({
      filterValue,
      filterOpen: false,
    },()=>{
      this.onSearch()
    })
  }

  onSearch=(searchValue, current)=>{
    const { filterValue = {}} = this.state
    const { pagination = {} } = this.props
    this.props.dispatch({
      type: 'baseInfo/getList',
      params: {
        page: current ? current: (pagination.current || 1),
        ...filterValue,
        searchValue
      }
    })
  }

  onCancel=()=>{
    this.setState({
      searchValue: ''
    })
    const { filterValue = {} } = this.state
    this.props.dispatch({
      type: 'baseInfo/getList',
      params: {
        page: 1,
        ...filterValue,
        searchValue: ''
      }
    })
  }

  del=()=>{
    this.props.dispatch({
      type: 'baseInfo/del',
      payload:{
        ehrId: this.state.ehrId
      }
    })
    this.setState({
      modal: false
    })
  }

  pageChange=(current)=>{
    this.onSearch(this.state.searchValue,current)
  }
  

  render() {
    const { list = [] } = this.props
    var baseInfoLists = list.length ? list.map((item, index) => (
      <Item 
        className={styles.baseInfoList}
        key={index}
        align="top"
        thumb={listThumb}
        extra={<Icon onClick={()=>this.showActionSheet(item.ehrId)} type="ellipsis" />}
        multipleLine>
        <Flex justify="between">
          <Flex.Item className={styles.message}>{item.clientName}</Flex.Item>
          <Flex.Item>{item.ddSex}</Flex.Item>
          <Flex.Item>{item.birthday && moment(item.birthday).format('YYYY-MM-DD')}</Flex.Item>
        </Flex>
        <div>健康档案编号：{item.ehrNewno}</div>
        <div>身份证号: {item.idCard}</div>
      </Item>
    )) :<div className={styles.noData}>暂无数据</div>
    return <div>
      <Drawer
        className={styles.my_drawer}
        style={{ minHeight: document.documentElement.clientHeight }}
        contentStyle={{ color: '#A6A6A6', textAlign: 'center', paddingTop: 42 }}
        sidebar={<FilterFrom getFilterValue={this.getFilterValue} filterValue={this.state.filterValue || {}}/>}
        open={this.state.filterOpen}
        position="right"
        onOpenChange={()=>{
          this.setState({
            filterOpen: false
          })
        }
        }
      >
        <Modal
          visible={this.state.modal}
          transparent
          maskClosable={false}
          onClose={()=>this.setState({modal: false})}
          title="确定删除？"
          footer={[
            { text: '取消', onPress: () => { this.setState({modal: false})}},
            { text: '确认', onPress: this.del }
          ]}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
        />
        <NavBar
          className={styles.navBar}
          icon={<Icon type="left" color='#fff'/>}
          onLeftClick={()=>{
            this.props.history.push('/home')
          }}
          rightContent={
            <Popover mask
              overlayClassName="fortest"
              overlayStyle={{ color: 'currentColor' }}
              visible={this.state.visible}
              onSelect={(node,index)=>{
                if(index===0){
                  this.setState({
                    visible: false,
                    filterOpen: true
                  })
                }
              }}
              overlay={[
                (<PopoverItem key="4" value="scan" icon={<Icon type="iconfont40" size="xs" />} data-seed="logId">筛选</PopoverItem>),
                (<PopoverItem key="5" value="special" icon={<Icon type="xuanze" size="xs" color="#aaa"/>} style={{ whiteSpace: 'nowrap' }}>选择</PopoverItem>),
                (<PopoverItem key="6" value="button ct" icon={<Icon type="ai238" size="xxs" color="#aaa"/>}>
                  <span style={{ marginRight: 5 }}>更多</span>
                </PopoverItem>),
              ]}
              align={{
                overflow: { adjustY: 0, adjustX: 0 },
                offset: [-10, 0],
              }}
              onVisibleChange={this.handleVisibleChange}
            >
              <div style={{
                height: '100%',
                padding: '0 15px',
                marginRight: '-15px',
                display: 'flex',
                alignItems: 'center',
              }}
              >
                <Icon type="liebiao" size="sm" color="#fff"/>
              </div>
            </Popover>
          }
          >
          基本信息
        </NavBar>
        <SearchBar 
        placeholder="姓名/健康档案卡号"
        value={this.state.searchValue}
        onChange={(searchValue)=>{
          this.setState({ searchValue })
        }}
        disabled={this.state.filterOpen}
        onSubmit={this.onSearch}
        onCancel={this.onCancel}
        />
        <div ref="baseInfoListWrapper"
          className={styles.baseInfoListWrapper} style={{height: this.state.height}}>
          <div>
            { this.props.listLoading ? 
            <div style={{justifyContent: 'center',display: 'flex'}}>
              <ActivityIndicator
                size='large'
              />
            </div> :
            <List>
              {baseInfoLists}
              <Pagination locale={locale} onChange={(e)=>this.pageChange(e)} {...this.props.pagination}/>
            </List>
            }
          </div>
        </div>
        <Button className={styles.createFrom} onClick={()=>this.props.dispatch(
            routerRedux.push({
              pathname: '/baseInfoFrom',
              query: null,
            })
          )}>创建基本信息</Button>
      </Drawer>
    </div>
  }
}

function mapStateToProps({ baseInfo, loading }) {
  return { 
    ...baseInfo,
    listLoading: loading.effects['baseInfo/getList']
  }
}

export default connect(mapStateToProps)(Home)
