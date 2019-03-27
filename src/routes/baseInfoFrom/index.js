import React from 'react';
import { connect } from 'dva'
import lodash from 'lodash'
import { NavBar, Icon, Toast, Steps, Tabs, ActivityIndicator } from 'antd-mobile';
import moment from 'moment';
import BaseInfo from './BaseInfo';
import MedicalInfo from './MedicalInfo';
import OtherInfo from './OtherInfo';
import styles from '../../router.less'

const Step = Steps.Step;
const tabs = [
  { title: 'First Tab' },
  { title: 'Second Tab' },
  { title: 'Third Tab' },
];
class BaseInfoFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      animating: false,
    };
  }
  componentWillMount=() =>{
    this.setState({
      height: Number(document.documentElement.clientHeight)-146+'px'
    })
  }
 
  leftClick=()=> {
    this.state.page === 0 ? this.props.history.push('/baseInfoList') : this.setState({
      page: this.state.page - 1 <= 0 ? 0 : this.state.page - 1
    })
  }

  nextClick=()=> {
    const { validateFields, getFieldError } = this.state.page===0 ? this.baseInfo: this.medicalInfo;
    validateFields((errors, values) => {
      if (errors) {
        for(let i in errors){
          Toast.info(getFieldError(i), 2, null, false);
          return
        }
        return
      }else{
        this.setState({
          page: this.state.page + 1 >= 2 ? 2 : this.state.page + 1
        })
      }
    })
  }

  onSubmit=()=>{
    this.setState({ animating: !this.state.animating });
    const { dispatch, modalType = 'create', detail={} } = this.props;
    const { validateFields, getFieldError  } = this.otherInfo;
    validateFields((errors, values) => {
      if (errors) {
        for(let i in errors){
          Toast.info(getFieldError(i), 2, null, false);
          this.closeTimer = setTimeout(() => {
            this.setState({ animating: !this.state.animating });
          }, 1000);
          return
        }
        return
      }else{
        const value = {...this.baseInfo.getFieldsValue(), ...this.medicalInfo.getFieldsValue(), ...values}
        //地址处理
        value.ddCommunity = value.zonecode[value.zonecode.length-1]
        // 医疗费用支付方式
        let feeListArr=[]
        value.feeList && lodash.compact(value.feeList.split('||')).forEach(item=>{
          feeListArr.push({
            ddFeesourceType: item
          })
        })
        value.feeList= feeListArr
        // 暴露史
        let baoluListArr=[]
        value.baoluList && lodash.compact(value.baoluList.split('||')).forEach(item=>{
          baoluListArr.push({
            ddBaoluType: item
          })
        })
        value.baoluList= baoluListArr
        // 患病类型
        let riskListArr=[]
        value.riskList && lodash.compact(value.riskList.split('||')).forEach(item=>{
          riskListArr.push({
            ddRiskType: item
          })
        })
        value.riskList= riskListArr

        // 人群属性
        let crowdListArr=[]
        value.crowdList && lodash.compact(value.crowdList.split('||')).forEach(item=>{
          crowdListArr.push({
            ddCrowdId: item
          })
        })
        value.crowdList= crowdListArr

        // 残疾情况
        let deformListArr=[]
        value.deformList && lodash.compact(value.deformList.split('||')).forEach(item=>{
          deformListArr.push({
            ddDeformType: item
          })
        })
        value.deformList= deformListArr
        const { disList={}, shouList={}, wsList={}, shuList={} } = value
        value.disList=lodash.values(disList)
        value.disList.forEach(item=>{
          for(let i in item){
            if(moment.isDate(item[i])){
              item[i]=moment(item[i]).format('YYYY-MM-DD')
            }
          }
        })
        
        value.shouList=lodash.values(shouList)
        value.shouList.forEach(item=>{
          for(let i in item){
            if(moment.isDate(item[i])){
              item[i]=moment(item[i]).format('YYYY-MM-DD')
            }
          }
        })
        value.wsList=lodash.values(wsList)
        value.wsList.forEach(item=>{
          for(let i in item){
            if(moment.isDate(item[i])){
              item[i]=moment(item[i]).format('YYYY-MM-DD')
            }
          }
        })
        value.shuList=lodash.values(shuList)
        value.shuList.forEach(item=>{
          for(let i in item){
            if(moment.isDate(item[i])){
              item[i]=moment(item[i]).format('YYYY-MM-DD')
            }
          }
        })
        console.log(JSON.stringify({...modalType==='create' ? {}: detail ,
        ...value}))

        //处理日期格式
        for(let i in value){
          if(moment.isDate(value[i])){
            value[i]=moment(value[i]).format('YYYY-MM-DD')
          }
        }
        dispatch({
          type: modalType==='create' ? 'baseInfo/add': 'baseInfo/update',
          params: {
            ...modalType==='create' ? {}: detail ,
            ...value
          }
        })
        this.closeTimer = this.setState({ animating: modalType==='create' ? this.props.addLoading : this.props.updateLoading})
      }
    })
  }
  
  render() {
    const steps = [{
      title: this.state.page===0 ? '进行中' : '已完成',
      className: 'baseInfo-step-on',
      description: '基本信息',
      icon: this.state.page===0 ? 'check-circle-o' : 'check-circle'
    }, {
      title: this.state.page===1 ? '进行中' : (this.state.page > 1 ? '已完成' : '待进行'),
      className: (this.state.page>1 || this.state.page===1) ? 'baseInfo-step-on' : '',
      description: '病史信息',
      icon: this.state.page===1 ? 'check-circle-o' : 'check-circle'
    }, {
      title: this.state.page===2 ? '进行中' : '待进行',
      className: this.state.page===2 ? 'baseInfo-step-on' : '',
      description: '其他信息',
      icon: this.state.page===2 ? 'check-circle-o' : 'check-circle'
    }].map((s, i) => <Step className={"baseInfo-step "+ s.className} key={i} title={s.title} description={s.description} icon={s.icon} />);
    const { detail = {} } = this.props
    const { disList=[], shouList=[], wsList=[], shuList=[] } = detail
    return (
    <div className={styles.baseInfoFrom}>
      <ActivityIndicator
        toast
        text="Loading..."
        animating={this.props.modalType==='update' && this.props.detailLoading}
      />
      <NavBar
        className={styles.navBar}
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={this.leftClick}
        rightContent={
        <div>
          {this.state.page !==2 && <span onClick={this.nextClick}>下一步</span>}
          {this.state.page ===2 && <span onClick={this.onSubmit}>提交</span>}
        </div>
        }
        >
        基本信息
      </NavBar>
      <Steps direction="horizontal" current={this.state.page} className={styles.baseInfoSteps}>
          {steps}
      </Steps>
      <div >
        <Tabs swipeable={false} page={this.state.page} tabs={tabs} onChange={(label,index)=>{
          this.setState({
            tabKey: index,
          })
        }}>
          <div style={{ height: this.state.height }}>
            <BaseInfo detail={detail} ref={(ref) => { this.baseInfo= ref}} />
          </div>
          <div style={{ height: this.state.height, backgroundColor: '#fff' }}>
            <MedicalInfo detail={{...detail, disList, shouList, wsList, shuList}} ref={(ref) => { this.medicalInfo= ref}} />
          </div>
          <div style={{ height: this.state.height, backgroundColor: '#fff' }}>
            <OtherInfo detail={detail} ref={(ref) => { this.otherInfo= ref}} />
          </div>
        </Tabs>
      </div>
      <div className="toast-example">
        <ActivityIndicator
          toast
          text="Loading..."
          animating={this.state.animating}
        />
      </div>
    </div>);
  }
}

function mapStateToProps({ baseInfo, loading }) {
  return { 
    ...baseInfo,
    detailLoading: loading.effects['baseInfo/getDetail'],
    addLoading: loading.effects['baseInfo/add'],
    updateLoading: loading.effects['baseInfo/update'],
  }
}

export default connect(mapStateToProps)(BaseInfoFrom);
