import React from 'react';
import { InputItem } from 'antd-mobile';
import CheckboxGroup from './CheckboxGroup';

class CheckboxOther extends React.Component {
  constructor(props) {
    super(props);
    const value = (props.checkboxProp && props.checkboxProp.value) ? props.checkboxProp.value.split('||') : []
    this.state = {
      value,
    };
  }

  UNSAFE_componentWillReceiveProps(_newProps){
    if(_newProps && _newProps.checkboxProp && _newProps.checkboxProp.value){
      this.setState({
        value: _newProps.checkboxProp.value
      })
    }
  }

  render() {
    const { checkboxProp={}, inputProp={} } = this.props
    return (<div style={{ height: '100%' }}>
      <CheckboxGroup {...checkboxProp} onChange={(e)=>{
        this.setState({
          value: e,
        })
        if(checkboxProp.onChange){
          checkboxProp.onChange(e)
        }
      }}/>
      {this.state.value && this.state.value.includes(checkboxProp.showdic) && 
      <InputItem
      {...inputProp}
      >
        {inputProp.label || ''}
      </InputItem>
      }
    </div>);
  }
}


export default CheckboxOther;
