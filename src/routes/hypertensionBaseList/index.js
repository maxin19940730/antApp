import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
import BScroll from 'better-scroll'
import styles from '../../router.less'
import listThumb from './listThumb.png'
import { routerRedux } from 'dva/router'
import FilterFrom from './FilterFrom'
// 高血压列表
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
      animating: false,
      height: Number(document.documentElement.clientHeight)-91+'px'
    }
  }

  componentWillMount= () => {
    this.props.dispatch({
      type: 'hypertension/getList',
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
      type: 'hypertension/getList',
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
      type: 'hypertension/getList',
      params: {
        page: 1,
        ...filterValue,
        searchValue: ''
      }
    })
  }

  pageChange=(current)=>{
    this.onSearch(this.state.searchValue,current)
  }

  getHList=(name, ehrId)=>{
    this.setState({ animating: !this.state.animating });
    this.props.dispatch({
      type: 'hypertension/getHList',
      params: {
        page: 1,
        name,
        ehrId,
      }
    })
    this.closeTimer = this.setState({ animating: this.props.HlistLoading })
  }
  
  render() {
    const { list = [] } = this.props
    let baseInfoLists = list.length ? list.map((item, index) => (
      <Item 
        className={styles.baseInfoList}
        key={index}
        align="top"
        thumb={listThumb}
        arrow="horizontal"
        multipleLine
        onClick={()=>this.getHList(item.clientName,item.ehrId)}
        >
        <Flex justify="between">
          <Flex.Item className={styles.message}>{item.clientName}</Flex.Item>
          <Flex.Item>{item.ddSex}</Flex.Item>
        </Flex>
        <div>健康档案编号：{item.ehrNewno}</div>
        <div>最近一次随访时间: {item.visitDate && moment(item.visitDate).format('YYYY-MM-DD')}</div>
      </Item>
    )) : <div className={styles.noData}>暂无数据</div>
    return <div>
      {this.props.HlistLoading && 
      <ActivityIndicator
        toast
        text="Loading..."
        animating={true}
      />}
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
          高血压列表
        </NavBar>
        <SearchBar 
        placeholder="姓名/健康档案卡号"
        maxLength={2}
        value={this.state.searchValue}
        onChange={(searchValue)=>{
          this.setState({ searchValue })
        }}
        disabled={this.state.filterOpen}
        onSubmit={this.onSearch}
        onCancel={this.onCancel}
        />
        <div ref="baseInfoListWrapper"
          className={styles.baseInfoListWrapper} style={{height: this.state.height,bottom: 0}}>
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
      </Drawer>
    </div>
  }
}

function mapStateToProps({ hypertension, loading }) {
  return {
    ...hypertension,
    listLoading: loading.effects['hypertension/getList'],
    HlistLoading: loading.effects['hypertension/getHList']
  }
}

export default connect(mapStateToProps)(Home)
