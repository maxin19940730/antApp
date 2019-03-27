import React from 'react';
import lodash from 'lodash';
import { request, config } from '../../utils';
import { Checkbox, Radio } from 'antd-mobile';
const RadioItem = Radio.RadioItem;

const { api = {} } = config
const CheckboxItem = Checkbox.CheckboxItem;
const warpDic = ComposedComponent => class WrapComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: [],
      radioValue: '',
      checkBoxValue: '',
    };
  }
  componentDidMount() {
    if (this.props.dic) {
      this.fetch();
      this.setState({
        value: this.props && this.props.value ? [this.props.value] : [],
        radioValue: this.props && this.props.value ? this.props.value : '',
        checkBoxValue: this.props && this.props.value ? this.props.value : ''
      })
    }
  }
  UNSAFE_componentWillReceiveProps (_newProps){
    if(_newProps.value!==this.props.value){
      this.setState({
        value: [_newProps.value],
      })
    }
  }
  fetch = () => {
    if (!sessionStorage.getItem('dic'.concat('-', this.props.dic)) || sessionStorage.getItem('dic'.concat('-', this.props.dic)) ==='null' || sessionStorage.getItem('dic'.concat('-', this.props.dic)) ==='undefined') {
      this.setState({ loading: true });
      this.promise = request(api.dicList,
        {
          method: 'GET',
          body: {
            dicType: this.props.dic,
          },
        }
      ).then((data) => {
        if (data && data.dicList) {
          sessionStorage.setItem('dic'.concat('-', this.props.dic), JSON.stringify(data.dicList));
          this.setState({ loading: false });
        } else {
          throw (data);
        }
      });
    }
  }
  handleSelect = (dic) => {
    const array = [];
    for (const key in dic) {
      if (dic) {
        array.push({"value": key, "label": dic[key].dicText})
      }
    }
    return array;
  }
  onCheckBoxChange = (e, value) => {
    const { checkBoxValue }=this.state
    let checkBoxValueArr = lodash.compact(checkBoxValue.split(','))
    if(e.target.checked){
      checkBoxValueArr.push(value)
    }else{
      lodash.remove(checkBoxValueArr, (n)=>n === value);
    }
    this.setState({
      checkBoxValue: checkBoxValueArr.join(','),
    });
    const onChange = this.props.onChange
    if (onChange) {
      onChange(checkBoxValueArr.join(','))
    }
  };

  onChange = (radioValue) => {
    this.setState({
      radioValue,
    });
    const onChange = this.props.onChange
    if (onChange) {
      onChange(radioValue)
    }
  };

  handleList = (dic , bool) => {
    const array = bool ? [{ label: '全部', value: '' }] : [];
    for (const key in dic) {
      if (dic) {
        array.push({ label: dic[key].dicText, value: key });
      }
    }
    return array;
  }

  radioChange = (value) => {
    this.setState({ value })
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value[0])
    }
  }

  render() {
    if (this.state && !this.state.loading) {
      if (this.props.type === 'P') {
        return (
          <ComposedComponent
            {...this.props}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            data={this.handleSelect(JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))))}
            value={this.state.value}
            onChange={this.radioChange}
          />
        );
      } else if (this.props.type === 'C') {
        return (
          <ComposedComponent
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {this.handleList(JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic)))).map(i => (
          <CheckboxItem key={i.value} checked={this.state.checkBoxValue.indexOf(i.value) !== -1} onChange={(e) => this.onCheckBoxChange(e, i.value)}>
            {i.label}
          </CheckboxItem>
          ))}
        </ComposedComponent>
        );
      } else if (this.props.type === 'R') {
        return (
          <ComposedComponent
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {this.handleList(JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))), !!this.props.hasall).map(i => (
          <RadioItem key={i.value} checked={this.state.radioValue === i.value} onChange={() => this.onChange(i.value)}>
            {i.label}
          </RadioItem>
          ))}
        </ComposedComponent>
        );
      }
      throw Error('请检查字典配置类型...');
    } else {
      return null;
    }
  }
};
export default warpDic;
