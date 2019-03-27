import React from 'react';
import { createForm } from 'rc-form';
import { CheckboxGroup } from '../../components/form';
import { List } from 'antd-mobile';
const Item = List.Item;
class OtherInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

 
  render() {
    const { detail = {} } = this.props
    const { getFieldProps, getFieldError } = this.props.form;
    return (
      <List>
        <Item arrow="empty">
          生活环境
        </Item>
        <form>
          <CheckboxGroup
            disablemark={true}
            disableddic = '1'
            label='厨房排风设施'
            dic='EHR_CLI_REGISTRY_KITCHEN'
            {...getFieldProps('chufang', {
              initialValue: detail.chufang,
            })}
          />
          <CheckboxGroup
            label='燃料类型'
            dic='EHR_CLI_REGISTRY_FUEL'
            {...getFieldProps('famFuel', {
              initialValue: detail.famFuel,
            })}
          />
          <CheckboxGroup
            label='饮水'
            dic='EHR_CLI_REGISTRY_DRINKING'
            {...getFieldProps('yinshui', {
              initialValue: detail.yinshui,
            })}
          />
          <CheckboxGroup
            label='厕所'
            dic='EHR_CLI_REGISTRY_TOILET'
            {...getFieldProps('famWashroom', {
              initialValue: detail.famWashroom,
            })}
          />
          <CheckboxGroup
            disablemark={true}
            disableddic = '1'
            label='禽畜栏'
            dic='EHR_CLI_REGISTRY_LIVESTOCK'
            {...getFieldProps('qinchu', {
              initialValue: detail.qinchu,
            })}
          />
        </form>
      </List>
    );
  }
}

export default createForm()(OtherInfo);
