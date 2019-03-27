import React from 'react';
import { createForm } from 'rc-form';
import warpDic from '../../components/warp/warpDic';
import styles from '../../router.less'
import { List, Accordion, Button } from 'antd-mobile';
const DicList = warpDic(List);
class FilterFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  primary=()=>{
    const { getFieldsValue } = this.props.form;
    if(this.props.getFilterValue){
      this.props.getFilterValue(getFieldsValue())
    }
  }

  reset=()=>{
    const { setFieldsValue, getFieldsValue } = this.props.form;
    setFieldsValue({
      ddSex: '',
      riskType: '',
      ddCrowd: ''
    })
    if(this.props.getFilterValue){
      this.props.getFilterValue(getFieldsValue())
    }
  }
 
  render() {
    const { getFieldProps } = this.props.form;
    const { filterValue = {} } = this.props;
    return (
      <List>
        <form>
          <List.Item arrow="选择条件" multipleLine>
          选择条件 <List.Item.Brief>选择条件</List.Item.Brief>
          </List.Item>
          <Accordion accordion className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="性别">
              <DicList 
                hasall={true}
                {...getFieldProps('ddSex', {
                  initialValue: filterValue.ddSex || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })}
                dic='EHR_CLI_REGISTRY_DD_SEX'
                type='R'
              />
            </Accordion.Panel>
            <Accordion.Panel header="人群属性" className="pad">
              <DicList 
                {...getFieldProps('riskType', {
                  initialValue: filterValue.riskType || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })}
                dic='EHR_CLI_REGISTRY_EHR_CROWD_ATTR'
                type='C'
              />
            </Accordion.Panel>
            <Accordion.Panel header="患病类型" className="pad">
            <DicList 
                {...getFieldProps('ddCrowd', {
                  initialValue: filterValue.ddCrowd || '',
                  rules: [
                    {
                      required: true,
                    },
                  ],
                })}
                dic='EHR_CLI_REGISTRY_EHR_HIGHRISK_ATTR'
                type='C'
              />
            </Accordion.Panel>
          </Accordion>
          <div className={styles.buttonBox}>
            <Button onClick={this.reset} style={{ color: '#1abc9c' }}>重置</Button>
            <Button onClick={this.primary} style={{ background: '#1abc9c' }} >确定</Button>
          </div>
        </form>
      </List>
    );
  }
}

export default createForm()(FilterFrom);
