import React from 'react';
import { createForm } from 'rc-form';
import styles from '../../router.less'
import { List, Accordion, Button, Radio } from 'antd-mobile';
const RadioItem = Radio.RadioItem;
const data = [
  { value: '0', label: '全部' },
  { value: '1', label: '有' },
  { value: '-1', label: '无' },
];
class FilterFrom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Flag: '0'
    };
  }

  primary=()=>{
    if(this.props.getFilterValue){
      this.props.getFilterValue({ Flag: this.state.Flag })
    }
  }

  reset=()=>{
    this.setState({
      Flag: '0'
    },()=>{
      this.primary()
    })
  }
 
  render() {
    return (
      <List>
        <form>
          <List.Item arrow="选择条件" multipleLine>
          选择条件 <List.Item.Brief>选择条件</List.Item.Brief>
          </List.Item>
          <Accordion accordion openAnimation={{}} className="my-accordion" onChange={this.onChange}>
            <Accordion.Panel header="高血压随访表记录">
              {data.map(i => (
                <RadioItem key={i.value} checked={this.state.Flag === i.value} onChange={() => {this.setState({
                  Flag: i.value
                })}}>
                  {i.label}
                </RadioItem>
              ))}
            </Accordion.Panel>
          </Accordion>
          <div className={styles.buttonBox}>
            <Button onClick={this.reset} style={{ color: '#1abc9c', border: '1px solid #1abc9c' }}>重置</Button>
            <Button onClick={this.primary} style={{ background: '#1abc9c' }} >确定</Button>
          </div>
          
        </form>
      </List>
    );
  }
}

export default createForm()(FilterFrom);
