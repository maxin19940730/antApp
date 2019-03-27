import React from 'react';
import { Picker, List, InputItem } from 'antd-mobile';
import warpDic from '../../components/warp/warpDic';

const DicPicker = warpDic(Picker);
class PickerOther extends React.Component {
  constructor(props) {
    super(props);
    const value = (props.dicPickerProp && props.dicPickerProp.value) || ''
    this.state = {
      value,
    };
  }

  UNSAFE_componentWillReceiveProps(_newProps){
    if(_newProps && _newProps.dicPickerProp && _newProps.dicPickerProp.value){
      this.setState({
        value: _newProps.dicPickerProp.value
      })
    }
  }


  render() {
    const { dicPickerProp = {}, inputProp = {} } = this.props
    return (<div style={{ height: '100%' }}>
      <DicPicker
        {...dicPickerProp}
        onChange={(e)=>{
          this.setState({
            value: e,
          })
          if(dicPickerProp.onChange){
            dicPickerProp.onChange(e)
          }
        }}
      >
        <List.Item error={ dicPickerProp.error } arrow="horizontal">{dicPickerProp.label||''}</List.Item>
      </DicPicker>
      {this.state.value === dicPickerProp.showdic && 
      <InputItem
      { ...inputProp }
      >
        { inputProp.label || '' }
      </InputItem>
      }
    </div>);
  }
}


export default PickerOther;
