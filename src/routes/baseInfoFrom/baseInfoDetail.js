import React from 'react';
import { connect } from 'dva'
import lodash from 'lodash'
import moment from 'moment'
import { NavBar, Icon, List, } from 'antd-mobile';
import styles from '../../router.less'
import BScroll from 'better-scroll'
import { ItemDetail } from '../../components/form';

const Item = List.Item;
const Brief = Item.Brief;
class BaseInfoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
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
  componentDidUpdate=()=> {
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
    const { disList=[], shouList=[], wsList=[], shuList=[], feeList = [], crowdList= [], riskList = [], deformList= [], baoluList=[] } = detail
    feeList.length && this.getList({
      obj: feeList,
      keys: 'feesourceType',
      name: 'feeListStr'
    })
    crowdList.length && this.getList({
      obj: crowdList,
      keys: 'ddCrowd',
      name: 'crowdListStr'
    })
    riskList.length && this.getList({
      obj: riskList,
      keys: 'riskType',
      name: 'riskListStr'
    })

    deformList.length && this.getList({
      obj: deformList,
      keys: 'deformType',
      name: 'deformListStr'
    })

    baoluList.length && this.getList({
      obj: baoluList,
      keys: 'baoluType',
      name: 'baoluListStr'
    })
    return (
    <div>
      <NavBar
        className={styles.navBar}
        icon={<Icon type="left" />}
        onLeftClick={()=>{
          this.props.history.push('/baseInfoList')
        }}
        >
        基本信息查看
      </NavBar>
      <div ref="detail" className={styles.detail}>
        <div>
          <List renderHeader={() => <div><Icon type={'check-circle'} color={'#1abc9c'} size='xxs'/> 基本信息</div>}>
            <ItemDetail extra={detail.clientName} label='姓名'/>
            <ItemDetail extra={detail.ehrNewno} label='编号'/>
            <ItemDetail extra={detail.sexV} label='性别'/>
            <ItemDetail extra={detail.birthday ? moment(detail.birthday).format('YYYY-MM-DD'):''} label='出生日期'/>
            <ItemDetail extra={detail.idCard} label='身份证号'/>
            <ItemDetail extra={detail.ddBystreet+detail.ddDoorplate+detail.ddGridding+detail.countryCommittee} label='地址'/>
            <ItemDetail extra={detail.workOrg} label='工作单位'/>
            <ItemDetail extra={detail.workPhone} label='本人电话'/>
            <ItemDetail extra={detail.emergency_name} label='联系人姓名'/>
            <ItemDetail extra={detail.mobile_phone} label='联系人电话'/>
            <ItemDetail extra={detail.nationV} label='民族'/>
            <ItemDetail extra={detail.liveTypeV} label='常住类型'/>
            <ItemDetail extra={detail.bloodTypeV} label='血型'/>
            <ItemDetail extra={detail.rhV} label='Rh'/>
            <ItemDetail extra={detail.educationV} label='文化程度'/>
            <ItemDetail extra={detail.drResponse} label='责任医师'/>
            <ItemDetail extra={detail.ddOccupationV} label='职业'/>
            <ItemDetail extra={detail.rprRelationV} label='与户主关系'/>
            <ItemDetail extra={detail.marriageV} label='婚姻状况'/>
            <ItemDetail extra={detail.feeListStr} label='医疗费用支付方式'/>
            <ItemDetail extra={detail.otherIll} label='其他'/>
            <ItemDetail extra={detail.issensitiveV} label='药物过敏史'/>
            <ItemDetail extra={detail.otherSens} label='其他'/>
            <ItemDetail extra={detail.baoluListStr} label='暴露史'/>
            <ItemDetail extra={detail.riskListStr} label='患病类型'/>
            <ItemDetail extra={detail.crowdListStr} label='人群属性'/>
            <ItemDetail extra={detail.hereditaryV} label='遗传病史'/>
            <ItemDetail extra={detail.hereditaryName} label='疾病名称'/>
            <ItemDetail extra={detail.deformListStr} label='残疾情况'/>
            <ItemDetail extra={detail.eles} label='其他残疾'/>
          </List>
          <List className="my-list" renderHeader={() => <div><Icon type={'check-circle'} color={'#1abc9c'} size='xxs'/> 既往史</div>}>
            <Item arrow="empty" multipleLine>
              既往史 <Brief>疾病</Brief>
            </Item>
            {disList.map((item, index) => {
              return <div key={item.id}>
              <ItemDetail extra={index+1} label='编号'/>
              <ItemDetail extra={item.ddDiseaseSel} label='疾病'/>
              <ItemDetail extra={item.nmDisease} label='备注'/>
              <ItemDetail extra={item.diagTime ? moment(detail.diagTime).format('YYYY-MM-DD'):''} label='确认时间'/>
            </div>
            })}
            <Item arrow="empty" multipleLine>
              既往史 <Brief>手术</Brief>
            </Item>
            {shouList.map((item, index) => {
              return <div key={item.id}>
              <ItemDetail extra={index+1} label='编号'/>
              <ItemDetail extra={item.shoushuname} label='名称'/>
              <ItemDetail extra={item.shoushudate ? moment(detail.shoushudate).format('YYYY-MM-DD'):''} label='时间'/>
            </div>
            })}
            <Item arrow="empty" multipleLine>
              既往史 <Brief>外伤</Brief>
            </Item>
            {wsList.map((item, index) => {
              return <div key={item.id}>
              <ItemDetail extra={index+1} label='编号'/>
              <ItemDetail extra={item.waishangname} label='名称'/>
              <ItemDetail extra={item.waishangdate ? moment(detail.waishangdate).format('YYYY-MM-DD'):''} label='时间'/>
            </div>
            })}
            <Item arrow="empty" multipleLine>
              既往史 <Brief>输血</Brief>
            </Item>
            {shuList.map((item, index) => {
              return <div key={item.id}>
              <ItemDetail extra={index+1} label='编号'/>
              <ItemDetail extra={item.shuxuename} label='原因'/>
              <ItemDetail extra={item.shuxuedate ? moment(detail.shuxuedate).format('YYYY-MM-DD'):''} label='时间'/>
            </div>
            })}
            <Item arrow="empty" multipleLine extra={''}>
              家族史
            </Item>
            <ItemDetail extra={detail.ifHaveFamilyillV} label='有无家族史'/>
            <ItemDetail extra={detail.fatherDiseaseV} label='父亲所患疾病'/>
            <ItemDetail extra={detail.father} label='其他'/>
            <ItemDetail extra={detail.motherDiseaseV} label='母亲所患疾病'/>
            <ItemDetail extra={detail.mother} label='其他'/>
            <ItemDetail extra={detail.brotherSisterDiseaseV} label='兄弟姐妹所患疾病'/>
            <ItemDetail extra={detail.brotherSister} label='其他'/>
            <ItemDetail extra={detail.sonDaugtherDiseaseV} label='子女所患疾病'/>
            <ItemDetail extra={detail.sonDaugther} label='其他'/>
          </List>
          <List className="my-list" renderHeader={() => <div><Icon type={'check-circle'} color={'#1abc9c'} size='xxs'/> 其他信息</div>}>
            <Item arrow="empty">
              生活环境
            </Item>
            <ItemDetail extra={detail.chufangV} label='厨房排风设施'/>
            <ItemDetail extra={detail.famFuelV} label='燃料类型'/>
            <ItemDetail extra={detail.yinshuiV} label='饮水'/>
            <ItemDetail extra={detail.famWashroomV} label='厕所'/>
            <ItemDetail extra={detail.qinchuV} label='禽畜栏'/>
          </List>
        </div>
      </div>
    </div>);
  }
}

function mapStateToProps({ baseInfo }) {
  return { ...baseInfo }
}


export default connect(mapStateToProps)(BaseInfoDetail);
