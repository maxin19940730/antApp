import React from 'react';

import { Modal, List, InputItem, Checkbox } from 'antd-mobile';
import { request, config } from '../../utils';
import './index.less'

const { api = {} } = config
const CheckboxItem = Checkbox.CheckboxItem;
class CheckboxGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      checkedObj: {},
    };
    this.changMark = true
  }

  componentDidMount() {
    this.fetch();
    this.changMark=true
    if(this.props && this.props.value){
      const value = (this.props.value && this.props.value) || ''
      const { disablemark = false, disableddic } = this.props
      let newValue = ''
      if(disablemark && value.indexOf(disableddic)!==-1 ) {
        newValue = disableddic
      }else{
        newValue = value
      }
      const onChange = this.props.onChange
      if (onChange) {
        onChange(newValue)
      } 
      this.setState({
        oldValue: newValue,
        value: newValue,
      },()=>{
        this.fetch(newValue.split('||'))
      },)
    }else{
      this.fetch()
    }
  }
  
  UNSAFE_componentWillReceiveProps (_newProps){
    const { disablemark = false, disableddic } = this.props
    if(_newProps.value && ( _newProps.value!==this.props.value) ){
      let value = ''
      if(disablemark && _newProps.value.split('||').indexOf(disableddic)!==-1){
        value = disableddic
      }else{
        value = _newProps.value
      }
      const onChange = this.props.onChange
      if (onChange) {
        onChange(value)
      }
      this.setState({
        value,
      },()=>{
        this.fetch(value.split('||'))
      })
    }
  }

  onOpenChange = () => {
    this.setState({ open: !this.state.open });
  }

  fetch = (newValue) => {
    let sessionDic = sessionStorage.getItem('dic'.concat('-', this.props.dic))
    if (!sessionDic || sessionDic==='undefined' || sessionDic==='null' ) {
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
          newValue && this.setDefaultValue(newValue, data.dicList)
          sessionStorage.setItem('dic'.concat('-', this.props.dic), JSON.stringify(data.dicList));
          this.setState({ dicObj: data.dicList, loading: false });
        } else {
          throw (data);
        }
      });
    }else{
      newValue && this.setDefaultValue(newValue, JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))))
      this.setState({ dicObj: JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))), loading: false });
    }
  }

  setDefaultValue=(value = [], dic)=>{
    const { disablemark = false, disableddic } = this.props
    let label=''
    const checkedObj = {}
    if(disablemark && value.indexOf(disableddic)!==-1){
      checkedObj[disableddic]=dic[disableddic].dicText
    }else{
      value.forEach(element => {
        checkedObj[element]=dic[element].dicText
      });
    }
    for (const key in checkedObj) {
      if (checkedObj) {
        label = label+checkedObj[key]+','
      }
    }
    this.setState({ checkedObj, label: label.substr(0,label.length-1) });
  }

  getData=(e, key, value)=>{
    const { disablemark = false, disableddic } = this.props
    this.changMark = false
    let { checkedObj } = this.state
    if(disablemark && key === disableddic){
      if(e.target.checked){
        let obj={}
        obj[key]=value
        checkedObj={...obj}
      }else{
        delete checkedObj[key]
      }
    }else{
      if(e.target.checked){
        checkedObj[key]=value
      }else{
        delete checkedObj[key]
      }
    }
    let values = ''
    for(let i in checkedObj){
      values = values+i+'||'
    }
    values = values.substr(0,values.length-2)
    this.setState({
      checkedObj,
      value: values,
    })
  }

  onChange=()=>{
    let label = ''
    const { checkedObj = {}, value = '' } = this.state
    for(let i in checkedObj){
      if(checkedObj[i]){
        label = label+checkedObj[i]+','
      } 
    }
    label = label.substr(0,label.length-1)
    const onChange = this.props.onChange
    if (onChange) {
      onChange(value)
    }
    this.setState({
      label,
      oldValue: value,
    }, ()=>{
      this.onOpenChange()
      this.setDefaultValue(value ? value.split('||'): [], JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))))
    })
  }

  reset=()=>{
    const { oldValue = '' } = this.state
    const onChange = this.props.onChange
    if (onChange) {
      onChange(oldValue)
    }
    this.setState({
      value: oldValue,
    }, ()=>{
      this.onOpenChange()
      this.setDefaultValue(oldValue ? oldValue.split('||') : [], JSON.parse(sessionStorage.getItem('dic'.concat('-', this.props.dic))))
    })
  }

  getOption = (dic) => {
    const { disablemark = false, disableddic } = this.props
    const { value = '' } = this.state
    let valueObj = value.split('||')
    const array = [];
    for (let key in dic) {
      if (dic) {
        array.push(<CheckboxItem
          disabled={disablemark && valueObj.indexOf(disableddic)!==-1 && disableddic!==key}
          checked={valueObj.indexOf(key)!==-1}
          key={key}
          onChange={(e)=>this.getData(e, key, dic[key].dicText)}
        >{dic[key].dicText}</CheckboxItem>);
      }
    }
    return array;
  }
  
  render() {
    const { dicObj = {} } = this.state
    if(!this.state.loading){
      return (<div style={{ height: '100%' }}>
        <InputItem 
          class='am-input-check'
          labelNumber={8}
          onClick={() => this.onOpenChange()}
          editable={false}
          {...this.props}
          placeholder={'请选择'}
          value={this.state.label}
          extra={<div class="am-list-arrow am-list-arrow-horizontal" aria-hidden="true"></div>}
        > {this.props.label || ''}
        </InputItem>
        <Modal
          popup
          visible={this.state.open}
          onClose={this.onOpenChange}
          animationType="slide-up"
          className="checkBoxModal"
          title={
          <div className="am-picker-popup-header">
            <div className="am-picker-popup-item am-picker-popup-header-left" onClick={this.reset}>取消</div>
            <div className="am-picker-popup-item am-picker-popup-title"></div>
            <div className="am-picker-popup-item am-picker-popup-header-right" onClick={this.onChange}>确定</div>
          </div>
          }
        >
          <List className="popup-list">
            {this.getOption(dicObj)}
          </List>
        </Modal>
      </div>);
    } 
    return null 
  }
}


export default CheckboxGroup;
