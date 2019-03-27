import React from 'react';
import { createForm } from 'rc-form';
import { connect } from 'dva'
import { district } from 'antd-mobile-demo-data';
import warpDic from '../../components/warp/warpDic';
import { ZonePicker, CheckboxGroup, CheckboxOther, PickerOther } from '../../components/form';
import { Toast, Picker, DatePicker, List, Checkbox, InputItem, Radio } from 'antd-mobile';
const CheckboxItem = Checkbox.CheckboxItem;
const DicPicker = warpDic(Picker);
const DicList = warpDic(List);

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pickerValue: [],
      dpValue: null,
    };
  }
  componentDidMount() {
  }
  render() {
    const { getFieldProps, getFieldsValue, validateFields, getFieldError } = this.props.form;
    const data = [
      { value: '01', label: 'doctor' },
      { value: '02', label: 'bachelor' },
    ];
    console.log('district',district)
    return (
    <div>
      <form className="form baseInfoFrom" onSubmit={()=>{
        validateFields((errors) => {
          if (errors) {
            return
          }
          console.log(getFieldsValue())
        })
        
      }}>
        <List renderHeader={() => <b>个人基本信息表</b>} >
          <Picker data={[
            {"value": "340000",
            "label": "安徽省",},
            {"value": "340001",
            "label": "男",}
          ]} cols={1}  >
            <List.Item arrow="horizontal">Single</List.Item>
          </Picker>
          <DicPicker dic='ISNE' type='P' cols={1}  >
            <List.Item arrow="horizontal">Single</List.Item>
          </DicPicker>
          <DicPicker data={district} dic='ISNE' type='P' cols={1} {...getFieldProps('district3', {initialValue: '01'})} >
            <List.Item arrow="horizontal">Single</List.Item>
          </DicPicker>
          <DicList 
            renderHeader={() => 'CheckboxItem demo'}
            getFieldProps={getFieldProps}
            fieldName='checkboxsss'
            fieldValue='01,02'
            dic='ISNE'
            type='C'
          />
          <CheckboxGroup 
            {...getFieldProps('111', {
              initialValue: '01,02',
              rules: [
                {
                  required: true,
                  message: '请输入正确的格式',
                },
              ],
            })}
            dic='QUOTA'
          />
          <InputItem pattern="[0-9]*" required error/> 
          <InputItem />
          <InputItem type="number" 
          {...getFieldProps('111', {
            initialValue: 1,
          })}
          />
          <InputItem pattern="[0-9]*" required />
          <InputItem type="submit" value="submit" />
          <CheckboxItem 
            {...getFieldProps('1111',{
              initialValue: true,
            })}
            onChange={(e) => console.log('checkbox', e)}
          >
            CheckboxItem
          </CheckboxItem>
          <Picker extra="请选择(可选)" data={district} title="选择地区" 
          {...getFieldProps('district', {
            initialValue: ['340000', '340800', '340824'],
          })}
          >
            <List.Item arrow="horizontal">省市区选择</List.Item>
          </Picker>
          <DatePicker
            mode="date"
            title="选择日期"
            extra="可选,小于结束日期"
            {...getFieldProps('date1', { initialValue: new Date() }) }
            minDate={new Date(2015, 8, 6)}
            maxDate={new Date(2017, 12, 3)}
          >
            <List.Item arrow="horizontal">日期</List.Item>
          </DatePicker> 
        </List>
        <List 
          renderHeader={() => 'CheckboxItem demo'}
        >
          {data.map(i => (
            <CheckboxItem key={i.value} {...getFieldProps('checkbox.'+i.value, { initialValue: null }) }>
              {i.label}
            </CheckboxItem>
          ))}
        </List>
        
        <CheckboxOther
          checkboxProp={{
            showdic: '08',
            label: '医疗费用支付方式',
            dic: 'YLFY',
            error: !!getFieldError('医疗费用支付方式'),
            onErrorClick: ()=>{
              Toast.info(getFieldError('医疗费用支付方式'), 1)
            },
            ...getFieldProps('医疗费用支付方式', {
              initialValue: '01,07',
              rules: [
                {
                  required: true,
                  message: '必填',
                },
              ],
            })
          }}
          inputProp={{
            label:'其他',
            ...getFieldProps('医疗费用支付方式其他', {
              initialValue: 1,
            })
          }}
        />
        <PickerOther
          dicPickerProp={{
            cols: 1,
            showdic: '01',
            label: '多选1111',
            dic: 'QUOTA',
            type: 'P',
            error: !!getFieldError('333111'),
            ...getFieldProps('333111', {
              initialValue: '02',
              rules: [
                {
                  required: true,
                  message: '请输入正确的格式',
                },
              ],
            })
          }}
          inputProp={{
            label:'其他',
            error: !!getFieldError('ssssss111'),
            ...getFieldProps('ssssss111', {
              initialValue: 1,
              rules: [
                {
                  required: true,
                  message: '请输入正确的格式',
                },
              ],
            })
          }}
        />
        <CheckboxGroup
          disablemark={true}
          disableddic='02'
          label='多选'
          dic='QUOTA'
          error={!!getFieldError('111')}
          onErrorClick={()=>{
            Toast.info(getFieldError('111'), 1)
          }}
          {...getFieldProps('111', {
            initialValue: '01,02',
            rules: [
              {
                required: true,
                message: '请输入正确的格式',
              },
            ],
          })}
        />
        <Picker extra="请选择(可选)"
          data={[{
            label: "安徽省",
            value: "340000"
          },
          {
            label: "澳门特别行政区",
            value: "820000"
          },
          {
            label: "北京",
            value: "110000",
          }
        ]}
          title="Areas"
          {...getFieldProps('district', {
            initialValue: ['340000', '341500', '341502'],
          })}
          onOk={e => console.log('ok', e)}
          onDismiss={e => console.log('dismiss', e)}
          onPickerChange={e => console.log('onPickerChange', e)}
        >
          <List.Item arrow="horizontal">Multiple & cascader</List.Item>
        </Picker> 
        <ZonePicker
          label='多选'
          error={!!getFieldError('111')}
          {...getFieldProps('111', {
            initialValue: [],
            rules: [
              {
                required: true,
                message: '请输入正确的格式',
              },
            ],
          })}
          />
        <InputItem type="submit" value="submit" />
      </form>
    </div>);
  }
}

function mapStateToProps({ detailState }) {
  return { ...detailState }
}


export default connect(mapStateToProps)(createForm()(Demo));
