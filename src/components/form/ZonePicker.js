import React from 'react';

import { Picker, List, InputItem, Checkbox } from 'antd-mobile';
import { request, config, arrayToTree } from '../../utils';
import styles from '../../router.less'
import './index.less'

const { api = {} } = config
const CheckboxItem = Checkbox.CheckboxItem;
class ZonePicker extends React.Component {
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
  }

  fetch = () => {
    let sessionDic = sessionStorage.getItem('dic-zone')
    if (!sessionDic || sessionDic==='undefined' || sessionDic==='null' ) {
      this.setState({ loading: true });
      this.promise = request(api.zoneList,
        {
          method: 'GET',
        }
      ).then((data) => {
        if (data && data.zoneList) {
          let zoneList = data.zoneList.map(item=>item={...item, value: item.zonecode, label: item.zonename})
          let datas = arrayToTree(zoneList, 'zonecode', 'pzonecode',)
          sessionStorage.setItem('dic-zone', JSON.stringify(datas));
          this.setState({ loading: false });
        } else {
          throw (data);
        }
      });
    }else{
      this.setState({ loading: false });
    }
  }
  
  render() {
    if(!this.state.loading){
      return (
      <Picker extra="请选择"
      cols={4}
      data={JSON.parse(sessionStorage.getItem('dic-zone'))}
      {...this.props}
    >
      <List.Item arrow="horizontal" error={this.props.error}>{this.props.require && <span className={styles.required}> * </span>}{this.props.label}</List.Item>
    </Picker> );
    } 
    return null 
  }
}


export default ZonePicker;
