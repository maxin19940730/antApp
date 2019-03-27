import React from 'react';
import { createForm } from 'rc-form';
import { Toast } from 'antd-mobile';
import lodash from 'lodash';
import BScroll from 'better-scroll'
import warpDic from '../../components/warp/warpDic';
import { ZonePicker, CheckboxGroup, CheckboxOther, PickerOther } from '../../components/form';
import moment from 'moment';
import { ptn, ptnMsg } from '../../utils';
import styles from '../../router.less'
import { Picker, DatePicker, List, InputItem } from 'antd-mobile';
const DicPicker = warpDic(Picker);
class BaseInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: Number(document.documentElement.clientHeight)-146+'px'
    };
  }
  componentDidMount=()=>{
    var bScroll = this.state.scroller
    if (bScroll) {
      bScroll.refresh()
    } else {
      this.setState({
        scroller: new BScroll(this.refs.baseInfoListWrapper, {
          click: true,
          scrollbar: {
            fade: true,
            interactive: false
          }
        }),
        
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
    console.log(name, detail[name])
    detail[name] = (str==='null'||str==='undefined') ? '': str
  }

  render() {
    const { detail = {}, modalType } = this.props
    const { getFieldProps, getFieldError } = this.props.form;
    const { feeList = [], crowdList= [], riskList = [], deformList= [], baoluList=[] } = detail
    feeList.length && this.getList({
      obj: feeList,
      keys: 'ddFeesourceType',
      name: 'feeListStr'
    })
    crowdList.length && this.getList({
      obj: crowdList,
      keys: 'ddCrowdId',
      name: 'crowdListStr'
    })
    riskList.length && this.getList({
      obj: riskList,
      keys: 'ddRiskType',
      name: 'riskListStr'
    })

    deformList.length && this.getList({
      obj: deformList,
      keys: 'ddDeformType',
      name: 'deformListStr'
    })

    baoluList.length && this.getList({
      obj: baoluList,
      keys: 'ddBaoluType',
      name: 'baoluListStr'
    })
    return (
      <List>
        <div ref="baseInfoListWrapper"
          className={styles.baseInfoListWrapper} style={{height: this.state.height, top: 0}}>
        <form >
          <InputItem
          {...getFieldProps('clientName', {
            initialValue: detail.clientName,
            rules: [
              {
                required: true,
                message: '姓名' + ptnMsg.required,
              },
            ],
          })}
          error={!!getFieldError('clientName')}
          onErrorClick={()=>{
            Toast.info(getFieldError('clientName'), 1)
          }}
          placeholder='请点击输入'
          >
            <span className={styles.required}> * </span>姓名
          </InputItem>
          {modalType==='update' && 
          <InputItem
          {...getFieldProps('ehrNewno', {
            initialValue: detail.ehrNewno,
            rules: [
              {
                required: true,
                message: '编号' + ptnMsg.required,
              },
            ],
          })}
          error={!!getFieldError('ehrNewno')}
          onErrorClick={()=>{
            Toast.info(getFieldError('ehrNewno'), 1)
          }}
          placeholder='请点击输入'
          disabled
          >
            <span className={styles.required}> * </span>编号
          </InputItem>
          }
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_SEX'
            type='P'
            cols={1}
            {...getFieldProps('sex', {
              initialValue: detail.sex,
              rules: [
                {
                  required: true,
                  message: '性别'+ ptnMsg.required,
                },
              ],
            })}
          >
            <List.Item error={!!getFieldError('sex')} arrow="horizontal"><span className={styles.required}> * </span>性别</List.Item>
          </DicPicker>
          <DatePicker
            mode="date"
            minDate={moment('1700-1-1').toDate()}
            format={(value)=>moment(value).format('YYYY-MM-DD')}
            {...getFieldProps('birthday', {
              initialValue: detail.birthday ? moment(detail.birthday).toDate() : null,
              rules: [
                {
                  required: true,
                  message: '出生日期'+ ptnMsg.required,
                },
              ],
            })}
          >
            <List.Item error={!!getFieldError('birthday')} arrow="horizontal"><span className={styles.required}> * </span>出生日期</List.Item>
          </DatePicker>
          <InputItem
          {...getFieldProps('idCard', {
            initialValue: detail.idCard,
            rules: [
              {
                pattern: ptn.idNo,
                message: ptnMsg.idNo,
              },
              {
                required: true,
                message: '身份证号'+ ptnMsg.required,
              },
            ],
          })}
          placeholder='请点击输入'
          error={!!getFieldError('idCard')}
          onErrorClick={()=>{
            Toast.info(getFieldError('idCard'), 1)
          }}>
            <span className={styles.required}> * </span>身份证号
          </InputItem>
          <ZonePicker
          require
          label='地址'
          error={!!getFieldError('zonecode')}
          {...getFieldProps('zonecode', {
            initialValue: detail.zonecode ? [detail.zonecode.zonecode1,detail.zonecode.zonecode2,detail.zonecode.zonecode3,detail.zonecode.zonecode4] : [],
            rules: [
              {
                required: true,
                message: '地址必填',
              },
            ],
          })}
          />
          <InputItem
          {...getFieldProps('workOrg', {
            initialValue: detail.workOrg,
          })}
          placeholder='请点击输入'
          error={!!getFieldError('workOrg')}
          onErrorClick={()=>{
            Toast.info(getFieldError('workOrg'), 1)
          }}>
            工作单位
          </InputItem>
          <InputItem
          {...getFieldProps('workPhone', {
            initialValue: detail.workPhone,
            rules: [
              {
                pattern: ptn.telephoneNo,
                message: ptnMsg.telephoneNo,
              },
            ],
          })}
          placeholder='请点击输入'
          error={!!getFieldError('workPhone')}
          onErrorClick={()=>{
            Toast.info(getFieldError('workPhone'), 1)
          }}>
            本人电话
          </InputItem>
          <InputItem
          {...getFieldProps('emergency_name', {
            initialValue: detail.emergency_name,
          })}
          placeholder='请点击输入'
          >
            联系人姓名
          </InputItem>
          <InputItem
          {...getFieldProps('mobile_phone', {
            initialValue: detail.mobile_phone,
            rules: [
              {
                pattern: ptn.telephoneNo,
                message: ptnMsg.telephoneNo,
              },
            ],
          })}
          placeholder='请点击输入'
          error={!!getFieldError('mobile_phone')}
          onErrorClick={()=>{
            Toast.info(getFieldError('mobile_phone'), 1)
          }}
          >
            联系人电话
          </InputItem>
          <DicPicker
            dic='EHR_CLI_REGISTRY_LIVE_TYPE'
            type='P'
            cols={1}
            {...getFieldProps('liveType', {
              initialValue: detail.liveType,
            })}
          >
            <List.Item arrow="horizontal">常住类型</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_NATION'
            type='P'
            cols={1}
            {...getFieldProps('nation', {
              initialValue: detail.nation,
              rules: [
                {
                  required: true,
                  message: '民族'+ ptnMsg.required,
                },
              ],
            })}
          >
            <List.Item arrow="horizontal" error={!!getFieldError('nation')}><span className={styles.required}> * </span>民族</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_BLOOD_TYPE'
            type='P'
            cols={1}
            {...getFieldProps('bloodType', {
              initialValue: detail.bloodType,
            })}
          >
            <List.Item arrow="horizontal">血型</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_RH'
            type='P'
            cols={1}
            {...getFieldProps('rh', {
              initialValue: detail.rh,
            })}
          >
            <List.Item arrow="horizontal">Rh</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_EDUCATION'
            type='P'
            cols={1}
            {...getFieldProps('education', {
              initialValue: detail.education,
              rules: [
                {
                  required: true,
                  message: '文化程度'+ ptnMsg.required,
                },
              ],
            })}
          >
            <List.Item arrow="horizontal" error={!!getFieldError('education')}><span className={styles.required}> * </span>文化程度</List.Item>
          </DicPicker>
          <InputItem
          {...getFieldProps('drResponse', {
            initialValue: detail.drResponse,
          })}
          placeholder='请点击输入'
          >
            责任医师
          </InputItem>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_OCCUPATION'
            type='P'
            cols={1}
            {...getFieldProps('ddOccupation', {
              initialValue: detail.ddOccupation,
            })}
          >
            <List.Item arrow="horizontal">职业</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_HOUSEHOLD_RELATIONSHIP'
            type='P'
            cols={1}
            {...getFieldProps('rprRelation', {
              initialValue: detail.rprRelation,
            })}
          >
            <List.Item arrow="horizontal">与户主关系</List.Item>
          </DicPicker>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_MARRIAGE'
            type='P'
            cols={1}
            {...getFieldProps('marriage', {
              initialValue: detail.marriage,
              rules: [
                {
                  required: true,
                  message: '婚姻状况'+ ptnMsg.required,
                },
              ],
            })}
          >
            <List.Item arrow="horizontal" error={!!getFieldError('marriage')}><span className={styles.required}> * </span>婚姻状况</List.Item>
          </DicPicker>
          <CheckboxOther
            checkboxProp={{
              showdic: '8',
              label: '医疗费用支付方式',
              dic: 'EHR_CLI_REGISTRY_DD_FEE_SOURCE',
              ...getFieldProps('feeList', {
                initialValue: detail.feeListStr,
              })
            }}
            inputProp={{
              label:'其他',
              ...getFieldProps('otherIll', {
                initialValue: detail.otherIll,
              })
            }}
          />
          <CheckboxOther
            checkboxProp={{
              disablemark: true,
              disableddic: '1',
              showdic: '5',
              label: '药物过敏史',
              dic: 'EHR_CLI_REGISTRY_ISSENSITIVE',
              ...getFieldProps('issensitive', {
                initialValue: detail.issensitive,
              })
            }}
            inputProp={{
              label:'其他',
              ...getFieldProps('otherSens', {
                initialValue: detail.otherSens,
              })
            }}
          />
          <CheckboxGroup
            disablemark={true}
            disableddic = '1'
            label='暴露史'
            dic='EHR_CLI_REGISTRY_EHR_BAOLU_ATTR'
            {...getFieldProps('baoluList', {
              initialValue: detail.baoluListStr,
            })}
          />
          <CheckboxGroup
            disablemark={true}
            disableddic = '64'
            label='患病类型'
            dic='EHR_CLI_REGISTRY_EHR_HIGHRISK_ATTR'
            {...getFieldProps('riskList', {
              initialValue: detail.riskListStr,
            })}
          />
          <CheckboxGroup
            disablemark={true}
            disableddic = '1'
            label='人群属性'
            dic='EHR_CLI_REGISTRY_EHR_CROWD_ATTR'
            {...getFieldProps('crowdList', {
              initialValue: detail.crowdListStr,
            })}
          />
          <PickerOther
            dicPickerProp={{
              cols: 1,
              showdic: '1',
              label: '遗传病史',
              dic: 'EHR_CLI_REGISTRY_DD_IFHAVE',
              type: 'P',
              ...getFieldProps('hereditary', {
                initialValue: detail.hereditary,
              })
            }}
            inputProp={{
              label:'疾病名称',
              ...getFieldProps('hereditaryName', {
                initialValue: detail.hereditaryName,
              })
            }}
          />
          <CheckboxOther
            checkboxProp={{
              disablemark: true,
              disableddic:  '1',
              showdic: '8',
              label: '残疾情况',
              dic: 'EHR_CLI_REGISTRY_DISABILITY_SITUATION',
              ...getFieldProps('deformList', {
                initialValue: detail.deformListStr,
              })
            }}
            inputProp={{
              label:'其他残疾',
              ...getFieldProps('eles', {
                initialValue: detail.eles,
              })
            }}
          />
        </form>
        </div>
      </List>
    );
  }
}

export default createForm()(BaseInfo);
