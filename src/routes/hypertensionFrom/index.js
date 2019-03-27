import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva'
import { CheckboxGroup } from '../../components/form';
import moment from 'moment';
import lodash from 'lodash';
import { NavBar, Icon, Toast } from 'antd-mobile';
import warpDic from '../../components/warp/warpDic';
import styles from '../../router.less'
import { ptnMsg } from '../../utils';
import BScroll from 'better-scroll'
import { ActivityIndicator, Picker, DatePicker, List, InputItem } from 'antd-mobile';
const DicPicker = warpDic(Picker);
// 通过自定义 moneyKeyboardWrapProps 修复虚拟键盘滚动穿透问题
// https://github.com/ant-design/ant-design-mobile/issues/307
// https://github.com/ant-design/ant-design-mobile/issues/163
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let moneyKeyboardWrapProps;
if (isIPhone) {
  moneyKeyboardWrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class HypertensionFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      animating: false,
      height: Number(document.documentElement.clientHeight)-44+'px'
    };
  }
  componentDidMount=()=>{
    var bScroll = this.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      this.setState({
        scroller: new BScroll(this.refs.hypertensionFrom, {
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

  onSubmit=()=>{
    const { dispatch, modalType, detail={}, form } = this.props;
    const { validateFields, getFieldError } = form;
    validateFields((errors, values) => {
      if (errors) {
        for(let i in errors){
          Toast.info(getFieldError(i), 2, null, false);
          return
        }
      }
      let symListArr=[]
      values.symList && lodash.compact(values.symList.split('||')).forEach(item=>{
        symListArr.push({
          key: item
        })
      })
      values.symList= symListArr
      values.ehrId=this.props.ehrId
      //机构id
      values.orgId=1
       //处理日期格式
      for(let i in values){
      if(moment.isDate(values[i])){
        values[i]=moment(values[i]).format('YYYY-MM-DD')
      }
      }
      dispatch({
        type: modalType==='create' ? 'hypertension/add': 'hypertension/update',
        params: {
          ...modalType==='create' ? {}: detail ,
          ...values
        }
      })
    })
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
    detail[name] = (str==='null'||str==='undefined') ? '': str
  }
  
  render() {
    const { detail = {} } = this.props
    const { getFieldProps, getFieldError } = this.props.form;
    const { symList = {} } = detail
    symList.length && this.getList({
      obj: symList,
      keys: 'key',
      name: 'symListStr'
    })
    return (
    <div>
      { this.props.loading &&
      <ActivityIndicator
        toast
        text="Loading..."
        animating={true}
      />}
      <NavBar
      className={styles.navBar}
      icon={<Icon type="left" />}
      onLeftClick={()=>this.props.history.push('/hypertensionList')}
      rightContent={<span onClick={this.onSubmit}>提交</span>}
      >
      随访记录{this.props.modalType==='create'? '创建': '修改'}
      </NavBar>
      <form  
      ref="hypertensionFrom"
      className={styles.hypertensionFrom}
      style={{ height: this.state.height }}
      >
        <List >
          <InputItem value={this.props.name} editable={false}>姓名</InputItem>
          <DatePicker
            mode="date"
            minDate={moment('1700-1-1').toDate()}
            format={(value)=>moment(value).format('YYYY-MM-DD')}
            {...getFieldProps('visitDate', {
              initialValue: detail.visitDate ? moment(detail.visitDate).toDate() : null,
              rules: [
                { required: true, message: '随访日期'+ ptnMsg.required },
              ],
            })}
          >
            <List.Item error={!!getFieldError('visitDate')} arrow="horizontal"><span className={styles.required}> * </span>随访日期</List.Item>
          </DatePicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_FOLLOW_WAY'
            type='P'
            cols={1}
            {...getFieldProps('visitWay', {
              initialValue: detail.visitWay,
            })}
          >
            <List.Item error={!!getFieldError('visitWay')} arrow="horizontal">随访方式</List.Item>
          </DicPicker>
          <CheckboxGroup
            disablemark={true}
            disableddic = '1'
            label='症状'
            dic='HYPERTENSION_FOLLOW_SERVER_VISIT_SYMPTOM'
            {...getFieldProps('symList', {
              initialValue: detail.symListStr,
            })}
          />
          {/* <InputItem
          {...getFieldProps('其他', {
            initialValue: '',
          })}
          error={!!getFieldError('其他')}
          onErrorClick={()=>{
            Toast.info(getFieldError('其他'), 1)
          }}>
            其他
          </InputItem> */}
          <List.Item arrow="empty" >
           <b> 体征 </b>
          </List.Item>
          <InputItem
          labelNumber={8}
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('lowPressure', {
            initialValue: detail.lowPressure,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          error={!!getFieldError('lowPressure')}
          onErrorClick={()=>{
            Toast.info(getFieldError('lowPressure'), 1)
          }}>
            血压-收缩压
          </InputItem>
          <InputItem
          labelNumber={8}
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('highPressure', {
            initialValue: detail.highPressure,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          error={!!getFieldError('highPressure')}
          onErrorClick={()=>{
            Toast.info(getFieldError('highPressure'), 1)
          }}>
            血压-舒展压
          </InputItem>
          <InputItem
          extra="kg"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('weight', {
            initialValue: detail.weight,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          error={!!getFieldError('weight')}
          onErrorClick={()=>{
            Toast.info(getFieldError('weight'), 1)
          }}>
            体重
          </InputItem>
          <InputItem
          extra="kg"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('targetWeight', {
            initialValue: detail.targetWeight,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          error={!!getFieldError('targetWeight')}
          onErrorClick={()=>{
            Toast.info(getFieldError('targetWeight'), 1)
          }}>
            体重
          </InputItem>
          <InputItem
          extra="kg/㎡"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('physiqueValue', {
            initialValue: detail.physiqueValue,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            体质指数
          </InputItem>
          <InputItem
          extra="次/分钟"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('heartRate', {
            initialValue: detail.heartRate,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            心率
          </InputItem>
          <InputItem
          {...getFieldProps('other', {
            initialValue: detail.other,
          })}
          error={!!getFieldError('other')}
          onErrorClick={()=>{
            Toast.info(getFieldError('other'), 1)
          }}>
            其他
          </InputItem>
          <List.Item arrow="empty" >
           <b> 生活方式指导 </b>
          </List.Item>
          <InputItem
          extra="支"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('smokeFrequency', {
            initialValue: detail.smokeFrequency,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            日吸烟量
          </InputItem>
          <InputItem
          extra="支"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('smokeFrequencyNext', {
            initialValue: detail.smokeFrequencyNext,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            日吸烟量
          </InputItem>
          <InputItem
          extra="两"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('drinkQuantity', {
            initialValue: detail.drinkQuantity,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            日饮酒量
          </InputItem>
          <InputItem
          extra="两"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('drinkQuantityNext', {
            initialValue: detail.drinkQuantityNext,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            日饮酒量
          </InputItem>
          <InputItem
          extra="次/周"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('sportFrequency', {
            initialValue: detail.sportFrequency,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            运动
          </InputItem>
          <InputItem
          extra="次/周"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('sportFrequencyNext', {
            initialValue: detail.sportFrequencyNext,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            运动
          </InputItem>
          <InputItem
          extra="分钟/次"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('sportTime', {
            initialValue: detail.sportTime,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            运动
          </InputItem>
          <InputItem
          extra="分钟/次"
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('sportTimeNext', {
            initialValue: detail.sportTimeNext,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            运动
          </InputItem>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_SALT_SITUATION'
            type='P'
            cols={1}
            {...getFieldProps('saltSituation', {
              initialValue: detail.saltSituation,
            })}
          >
            <List.Item arrow="horizontal">摄盐情况</List.Item>
          </DicPicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_SALT_SITUATION'
            type='P'
            cols={1}
            {...getFieldProps('targetSaltSituation', {
              initialValue: detail.targetSaltSituation,
            })}
          >
            <List.Item arrow="horizontal">摄盐情况</List.Item>
          </DicPicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_VISIT_MEDTAL_SITUATION'
            type='P'
            cols={1}
            {...getFieldProps('medtalSituation', {
              initialValue: detail.medtalSituation,
            })}
          >
            <List.Item arrow="horizontal">心理调整</List.Item>
          </DicPicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_VISIT_OBEY_BEHAVIOR'
            type='P'
            cols={1}
            {...getFieldProps('obeyBehavior', {
              initialValue: detail.obeyBehavior,
            })}
          >
            <List.Item arrow="horizontal">遵医行为</List.Item>
          </DicPicker>
          <InputItem
          {...getFieldProps('examine', {
            initialValue: detail.examine,
          })}
          >
            辅助检查
          </InputItem>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_DIA_MED_AGREE'
            type='P'
            cols={1}
            {...getFieldProps('diaMedAgree', {
              initialValue: detail.diaMedAgree,
            })}
          >
            <List.Item arrow="horizontal">服药依从性</List.Item>
          </DicPicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_VISIT_DIA_MED_SITUATION'
            type='P'
            cols={1}
            {...getFieldProps('diaMedSituation', {
              initialValue: detail.diaMedSituation,
            })}
          >
            <List.Item arrow="horizontal">药物不良反应</List.Item>
          </DicPicker>
          <DicPicker
            dic='HYPERTENSION_FOLLOW_SERVER_VISIT_DIA_MED_TYPE'
            type='P'
            cols={1}
            {...getFieldProps('diaMedType', {
              initialValue: detail.diaMedType,
            })}
          >
            <List.Item arrow="horizontal">此次随访分类</List.Item>
          </DicPicker>
          <List.Item arrow="empty">
            <b> 用药情况 </b>
          </List.Item>
          <InputItem
            {...getFieldProps('medName1', {
              initialValue: detail.medName1,
            })}
            >
              药品名称1
          </InputItem>
          <InputItem
            extra="次"
            type='money' moneyKeyboardAlign='left'
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            {...getFieldProps('medTime1', {
              initialValue: detail.medTime1,
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
          >
            每日
          </InputItem>
          <InputItem
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('medDose1', {
            initialValue: detail.medDose1,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            每次
          </InputItem>
          <DicPicker
            dic='VISIT_PUB_DD_UOM'
            type='P'
            cols={1}
            {...getFieldProps('medUom1', {
              initialValue: detail.medUom1,
            })}
          >
            <List.Item arrow="horizontal">用药单位</List.Item>
          </DicPicker>
          <InputItem
            {...getFieldProps('medName2', {
              initialValue: detail.medName2,
            })}
            >
              药品名称2
          </InputItem>
          <InputItem
            extra="次"
            type='money' moneyKeyboardAlign='left'
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            {...getFieldProps('medTime2', {
              initialValue: detail.medTime2,
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
          >
            每日
          </InputItem>
          <InputItem
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('medDose2', {
            initialValue: detail.medDose2,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            每次
          </InputItem>
          <DicPicker
            dic='VISIT_PUB_DD_UOM'
            type='P'
            cols={1}
            {...getFieldProps('medUom2', {
              initialValue: detail.medUom2,
            })}
          >
            <List.Item arrow="horizontal">用药单位</List.Item>
          </DicPicker>
          <InputItem
            {...getFieldProps('medName3', {
              initialValue: detail.medName3,
            })}
            >
              药品名称3
          </InputItem>
          <InputItem
            type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            {...getFieldProps('medTime3', {
              initialValue: detail.medTime3,
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
          >
            每日
          </InputItem>
          <InputItem
          type='money'
          moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('medDose3', {
            initialValue: detail.medDose3,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            每次
          </InputItem>
          <DicPicker
            dic='VISIT_PUB_DD_UOM'
            type='P'
            cols={1}
            {...getFieldProps('medUom3', {
              initialValue: detail.medUom3,
            })}
          >
            <List.Item arrow="horizontal">用药单位</List.Item>
          </DicPicker>
          <InputItem
            {...getFieldProps('medName4', {
              initialValue: detail.medName4,
            })}
            >
              其他药物
          </InputItem>
          <InputItem
            extra="次"
            type='money' moneyKeyboardAlign='left'
            moneyKeyboardWrapProps={moneyKeyboardWrapProps}
            {...getFieldProps('medTime4', {
              initialValue: detail.medTime4,
              normalize: (v, prev) => {
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
          >
            每日
          </InputItem>
          <InputItem
          type='money' moneyKeyboardAlign='left'
          moneyKeyboardWrapProps={moneyKeyboardWrapProps}
          {...getFieldProps('medDose4', {
            initialValue: detail.medDose4,
            normalize: (v, prev) => {
              if (v && !/^(([1-9]\d*)|0)(\.\d{0,20}?)?$/.test(v)) {
                if (v === '.') {
                  return '0.';
                }
                return prev;
              }
              return v;
            },
          })}
          >
            每次
          </InputItem>
          <DicPicker
            dic='VISIT_PUB_DD_UOM'
            type='P'
            cols={1}
            {...getFieldProps('medUom4', {
              initialValue: detail.medUom4,
            })}
          >
            <List.Item arrow="horizontal">用药单位</List.Item>
          </DicPicker>
          <List.Item arrow="empty" >
           <b> 转诊 </b>
          </List.Item>
          <InputItem
          labelNumber={6}
          {...getFieldProps('transReason', {
            initialValue: detail.transReason,
          })}
          >
            原因
          </InputItem>
          <InputItem
          labelNumber={6}
          {...getFieldProps('transHospital', {
            initialValue: detail.transHospital,
          })}
          >
            机构及科别
          </InputItem>
          <DatePicker
            mode="date"
            minDate={moment('1700-1-1').toDate()}
            format={(value)=>moment(value).format('YYYY-MM-DD')}
            {...getFieldProps('nextDate', {
              initialValue: detail.nextDate ? moment(detail.nextDate).toDate(): null,
            })}
          >
            <List.Item error={!!getFieldError('nextDate')} arrow="horizontal">下次随访日期</List.Item>
          </DatePicker>
          <InputItem
          labelNumber={8}
          error={!!getFieldError('doctor')}
          onErrorClick={()=>{
            Toast.info(getFieldError('doctor'), 1)
          }}
          {...getFieldProps('doctor', {
            initialValue: detail.doctor,
            rules: [
              {
                required: true,
                message: '随访医生签名'+ ptnMsg.required,
              },
            ],
          })}
          >
            <span className={styles.required}> * </span>随访医生签名
          </InputItem>
        </List>
      </form>
    </div>);
  }
}

function mapStateToProps({ hypertension, loading }) {
  return { 
    ...hypertension,
    addLoading: loading.effects['hypertension/add'],
    updateLoading: loading.effects['hypertension/update'],
    detailLoading: loading.effects['hypertension/getDetail'],
    loading: loading.effects['hypertension/add']||loading.effects['hypertension/update']||loading.effects['hypertension/getDetail']
  }
}


export default connect(mapStateToProps)(createForm()(HypertensionFrom));