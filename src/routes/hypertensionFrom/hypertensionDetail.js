import React from 'react';
import { connect } from 'dva'
import lodash from 'lodash'
import moment from 'moment'
import { NavBar, Icon, List, } from 'antd-mobile';
import styles from '../../router.less'
import BScroll from 'better-scroll'
import { ItemDetail } from '../../components/form';

class BaseInfoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount=()=>{
    var bScroll = this.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      this.setState({
        scroller: new BScroll(this.refs.detail, {
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

  getList=({name='', obj=[], keys='' })=>{
    const { detail = {} } = this.props
    let str=''
    lodash.forEach(obj,function(element, i) {
      if(i === (obj.length-1)){
        str+=element[keys]
      }else{
        str+=element[keys]+"||"
      }
    })
    detail[name]=str
  }

  render() {
    const { detail = {} } = this.props
    const { symList=[] } = detail
    symList.length && this.getList({
      obj: symList,
      keys: 'keyV',
      name: 'symListStr'
    })
    return (
    <div>
      <NavBar
        className={styles.navBar}
        icon={<Icon type="left" />}
        onLeftClick={()=>{
          this.props.history.push('/hypertensionList')
        }}
        >
        随访查看
      </NavBar>
      <div ref="detail" className={styles.detail}>
        <List>
          <ItemDetail extra={this.props.name} label='姓名'/>
          <ItemDetail extra={detail.visitDate ? moment(detail.visitDate).format('YYYY-MM-DD'):''} label='随访日期'/>
          <ItemDetail extra={detail.visitWayV} label='随访方式'/>
          <ItemDetail extra={detail.symListStr} label='症状'/>
          <List.Item arrow="empty" >
           <b> 体征 </b>
          </List.Item>
          <ItemDetail extra={detail.lowPressure} label='血压-收缩压'/>
          <ItemDetail extra={detail.highPressure} label='血压-舒展压'/>
          <ItemDetail extra={detail.weight} extra2={detail.targetWeight} between="~" affter="kg" label='体重'/>
          <ItemDetail extra={detail.weight} affter="kg/㎡" label='体质指数'/>
          <ItemDetail extra={detail.heartRate} affter="次/分钟" label='心率'/>
          <ItemDetail extra={detail.other} label='其他'/>
          <List.Item arrow="empty" >
           <b> 生活方式指导 </b>
          </List.Item>
          <ItemDetail extra={detail.smokeFrequencyt} extra2={detail.smokeFrequencyNext} between="~" affter="支" label='日吸烟量'/>
          <ItemDetail extra={detail.drinkQuantity} extra2={detail.drinkQuantityNext} affter="支" between="~" label='日饮酒量'/>
          <ItemDetail extra={detail.sportFrequency} extra2={detail.sportFrequencyNext} affter="次/周" between="~" label='运动'/>
          <ItemDetail extra={detail.sportTime} extra2={detail.sportTimeNext} affter="分钟/次" between="~" label='运动'/>
          <ItemDetail extra={detail.saltSituationV} label='摄盐情况'/>
          <ItemDetail extra={detail.targetSaltSituationV} label='摄盐情况'/>
          <ItemDetail extra={detail.medtalSituationV} label='心理调整'/>
          <ItemDetail extra={detail.obeyBehaviorV} label='遵医行为'/>
          <ItemDetail extra={detail.examine} label='辅助检查'/>
          <ItemDetail extra={detail.diaMedAgreeV} label='服药依从性'/>
          <ItemDetail extra={detail.diaMedSituationV} label='药物不良反应'/>
          <ItemDetail extra={detail.diaMedTypeV} label='此次随访分类'/>
          <List.Item arrow="empty">
            <b> 用药情况 </b>
          </List.Item>
          <ItemDetail extra={detail.medName1} label='药品名称1'/>
          <ItemDetail extra={detail.medTime1} affter="次" label='每日'/>
          <ItemDetail extra={detail.medDose1} affter={detail.medUom1V} label='每次'/>
          <ItemDetail extra={detail.medName2} label='药品名称2'/>
          <ItemDetail extra={detail.medTime2} affter="次" label='每日'/>
          <ItemDetail extra={detail.medDose2} affter={detail.medUom2V} label='每次'/>
          <ItemDetail extra={detail.medName3} label='药品名称3'/>
          <ItemDetail extra={detail.medTime3} affter="次" label='每日'/>
          <ItemDetail extra={detail.medDose3} affter={detail.medUom3V} label='每次'/>
          <ItemDetail extra={detail.medName4} label='其他药物'/>
          <ItemDetail extra={detail.medTime4}  affter="次" label='每日'/>
          <ItemDetail extra={detail.medDose4} affter={detail.medUom4V} label='每次'/>
          <List.Item arrow="empty" >
           <b> 转诊 </b>
          </List.Item>
          <ItemDetail extra={detail.transReason} label='原因'/>
          <ItemDetail extra={detail.transHospital} label='机构及科别'/>
          <ItemDetail extra={detail.nextDate} label='下次随访日期'/>
          <ItemDetail extra={detail.doctor} label='随访医生签名'/>
        </List>
      </div>
    </div>);
  }
}

function mapStateToProps({ hypertension }) {
  return { ...hypertension }
}


export default connect(mapStateToProps)(BaseInfoDetail);
