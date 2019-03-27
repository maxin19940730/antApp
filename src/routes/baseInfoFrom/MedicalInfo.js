import React from 'react';
import { createForm } from 'rc-form';
import warpDic from '../../components/warp/warpDic';
import moment from 'moment';
import BScroll from 'better-scroll'
import styles from '../../router.less'
import { Button, Picker, DatePicker, List, InputItem } from 'antd-mobile';
const DicPicker = warpDic(Picker);
const Item = List.Item;
const Brief = Item.Brief;
class MedicalInfo extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      disList: [], // 疾病
      medicalNum: 0,
      shouList: [], // 手术
      surgeryNum: 0,
      wsList: [], // 外伤
      traumaNum: 0,
      shuList: [], // 输血
      bloodNum: 0,
      height: Number(document.documentElement.clientHeight)-146+'px'
    };
  }

  componentDidMount=() =>{
    const { detail = [] } = this.props
    const { disList=[], shouList=[], wsList=[], shuList=[] } = detail
    this.setState({
      disList,
      shouList,
      wsList,
      shuList,
      ifHaveFamilyill: detail.ifHaveFamilyill || '',
      fatherDisease: detail.fatherDisease || '',
      motherDisease: detail.motherDisease || '',
      brotherSisterDisease: detail.brotherSisterDisease || '',
      sonDaugtherDisease: detail.sonDaugtherDisease || '',
    })
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
        })
      }, function () {
        bScroll = bScroll || this.state.scroller
      });
    }
  }

  UNSAFE_componentWillReceiveProps (_newProps){
    if(_newProps.detail){
      if(_newProps.detail.disList && _newProps.detail.disList.length!==this.props.detail.disList.length){
        this.setState({
          disList: _newProps.detail.disList || [],
        })
      }
      if(_newProps.detail.shouList && _newProps.detail.shouList.length!==this.props.detail.shouList.length){
        this.setState({
          shouList: _newProps.detail.shouList || [],
        })
      }
      if(_newProps.detail.wsList && _newProps.detail.wsList.length!==this.props.detail.wsList.length){
        this.setState({
          wsList: _newProps.detail.wsList || [],
        })
      }
      if(_newProps.detail.shuList && _newProps.detail.shuList.length!==this.props.detail.shuList.length){
        this.setState({
          shuList: _newProps.detail.shuList || [],
        })
      }
      if(_newProps.detail.ifHaveFamilyill && _newProps.detail.ifHaveFamilyill!==this.state.ifHaveFamilyill){
        this.setState({
          ifHaveFamilyill: _newProps.detail.ifHaveFamilyill
        })
      }
      if(_newProps.detail.fatherDisease && _newProps.detail.fatherDisease!==this.state.fatherDisease){
        this.setState({
          fatherDisease: _newProps.detail.fatherDisease
        })
      }
      if(_newProps.detail.motherDisease && _newProps.detail.motherDisease!==this.state.motherDisease){
        this.setState({
          motherDisease: _newProps.detail.motherDisease
        })
      }
      if(_newProps.detail.brotherSisterDisease && _newProps.detail.brotherSisterDisease!==this.state.brotherSisterDisease){
        this.setState({
          brotherSisterDisease: _newProps.detail.brotherSisterDisease
        })
      }
      if(_newProps.detail.sonDaugtherDisease && _newProps.detail.sonDaugtherDisease!==this.state.sonDaugtherDisease){
        this.setState({
          sonDaugtherDisease: _newProps.detail.sonDaugtherDisease
        })
      }
    }
  }

  addMedical=(itemType, itemNum, key)=>{
    let obj={}
    obj[key]='no' + this.state[itemNum]
    this.state[itemType].push(obj)
    let arr = {}
    arr[itemType]=this.state[itemType]
    arr[itemNum]=this.state[itemNum]+1
    this.setState(arr)
  }
  delMedical=(i, itemType, key)=>{
    let arr={}
    arr[itemType]=this.state[itemType] ? this.state[itemType].filter((item)=>item[key]!==i) : []
    this.setState(arr)
  }
 
  render() {
    const { detail = [] } = this.props
    const { disList=[], shouList=[], wsList=[], shuList=[] } = this.state
    const { getFieldProps } = this.props.form;
    return (
      <List>
        <div ref="baseInfoListWrapper"
          className={styles.baseInfoListWrapper} style={{height: this.state.height, top: 0}}>
        <form>
          <Item arrow="empty" multipleLine onClick={() => {}} extra={<Button onClick={()=>this.addMedical('disList', 'medicalNum', 'illHistoryId')} type="ghost" size="small" inline> 添加 </Button>}>
            既往史 <Brief>疾病</Brief>
          </Item>
          {disList.map((item, index) => {
            return <div key={item.illHistoryId}>
            <InputItem
              value={index+1}
            >
                编号
              </InputItem>
              <DicPicker
                dic='DISEASE_TYPE'
                type='P'
                cols={1}
                {...getFieldProps(`disList.${item.illHistoryId}.ddDiseaseSel`, {
                  initialValue: item.ddDiseaseSel,
                })}
              >
                <List.Item arrow="horizontal">疾病</List.Item>
              </DicPicker>
              <InputItem
              {...getFieldProps(`disList.${item.illHistoryId}.nmDisease`, {
                initialValue: item.nmDisease,
              })}
              >
                备注
              </InputItem>
              <DatePicker
                mode="date"
                minDate={new Date(1700, 1, 1, 0, 0, 0)}
                format={(value)=>moment(value).format('YYYY-MM-DD')}
                {...getFieldProps(`disList.${item.illHistoryId}.diagTime`, {
                  initialValue: item.diagTime ? moment(item.diagTime).toDate(): null,
                })}
              >
                <List.Item arrow="horizontal">确认时间</List.Item>
              </DatePicker>
              <List.Item> <Button type="warning" onClick={()=>this.delMedical(item.illHistoryId, 'disList', 'illHistoryId')}>删除</Button></List.Item>
          </div>
          })}
          <Item arrow="empty" multipleLine extra={<Button onClick={()=>this.addMedical('shouList', 'surgeryNum', 'shId')} type="ghost" size="small" inline> 添加 </Button>}>
            既往史 <Brief>手术</Brief>
          </Item>
          {shouList.map((item, index) => {
            return <div key={item.shId}>
              <InputItem
              value={index+1}
              >
                编号
              </InputItem>
              <InputItem
              {...getFieldProps(`shouList[${item.shId}].shoushuname`, {
                initialValue: item.shoushuname,
              })}
              >
                名称
              </InputItem>
              <DatePicker
                mode="date"
                minDate={new Date(1700, 1, 1, 0, 0, 0)}
                format={(value)=>moment(value).format('YYYY-MM-DD')}
                {...getFieldProps(`shouList[${item.shId}].shoushudate`, {
                  initialValue: item.shoushudate ? moment(item.shoushudate).toDate(): null,
                })}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <List.Item> <Button type="warning" onClick={()=>this.delMedical(item.shId, 'disList', 'shId')}>删除</Button></List.Item>
          </div>
          })}
          <Item arrow="empty" multipleLine extra={<Button onClick={()=>this.addMedical('wsList', 'traumaNum', 'wsId')} type="ghost" size="small" inline> 添加 </Button>}>
            既往史 <Brief>外伤</Brief>
          </Item>
          {wsList.map((item, index) => {
            return <div key={item.wsId}>
            <InputItem
              value={index+1}>
                编号
              </InputItem>
              <InputItem
              {...getFieldProps(`wsList[${item.wsId}].waishangname`, {
                initialValue: item.waishangname,
              })}
              >
                名称
              </InputItem>
              <DatePicker
                mode="date"
                minDate={new Date(1700, 1, 1, 0, 0, 0)}
                format={(value)=>moment(value).format('YYYY-MM-DD')}
                {...getFieldProps(`wsList[${item.wsId}].waishangdate`, {
                  initialValue: item.waishangdate ? moment(item.waishangdate).toDate(): null,
                })}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <List.Item> <Button type="warning" onClick={()=>this.delMedical(item.id, 'disList', 'wsId')}>删除</Button></List.Item>
          </div>
          })}
          <Item arrow="empty" multipleLine extra={<Button onClick={()=>this.addMedical('shuList', 'bloodNum', 'sxId')} type="ghost" size="small" inline> 添加 </Button>}>
            既往史 <Brief>输血</Brief>
          </Item>
          {shuList.map((item, index) => {
            return <div key={item.sxId}>
            <InputItem
              value={index+1}
              >
                编号
              </InputItem>
              <InputItem
              {...getFieldProps(`shuList[${item.sxId}].shuxuename`, {
                initialValue: item.shuxuename,
              })}
              >
                原因
              </InputItem>
              <DatePicker
                mode="date"
                minDate={new Date(1700, 1, 1, 0, 0, 0)}
                format={(value)=>moment(value).format('YYYY-MM-DD')}
                {...getFieldProps(`shuList[${item.sxId}].shuxuedate`, {
                  initialValue: item.shuxuedate ? moment(item.shuxuedate).toDate(): null,
                })}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <List.Item> <Button type="warning" onClick={()=>this.delMedical(item.id, 'disList', 'sxId')}>删除</Button></List.Item>
          </div>
          })}
          <Item arrow="empty" multipleLine extra={''}>
            家族史
          </Item>
          <DicPicker
            dic='EHR_CLI_REGISTRY_DD_IFHAVE'
            type='P'
            cols={1}
            {...getFieldProps('ifHaveFamilyill', {
              initialValue: detail.ifHaveFamilyill,
              onChange: (e)=>{
                this.setState({
                  ifHaveFamilyill: e
                })
              },
            })}
          >
            <List.Item arrow="horizontal">有无家族史</List.Item>
          </DicPicker>
          {
            this.state.ifHaveFamilyill==='1' && 
            <div>
              <DicPicker
                dic='EHR_CLI_REGISTRY_DISEASE'
                type='P'
                cols={1}
                {...getFieldProps('fatherDisease', {
                  initialValue: detail.fatherDisease,
                  onChange: (e)=>{
                    this.setState({
                      fatherDisease: e
                    })
                  },
                })}
              >
                <List.Item arrow="horizontal">父亲所患疾病</List.Item>
              </DicPicker>
              {
                this.state.fatherDisease === '12' && <InputItem
                {...getFieldProps('father', {
                  initialValue: detail.father,
                })}
                >
                  其他
                </InputItem>
              }
              <DicPicker
                dic='EHR_CLI_REGISTRY_DISEASE'
                type='P'
                cols={1}
                {...getFieldProps('motherDisease', {
                  initialValue: detail.motherDisease,
                  onChange: (e)=>{
                    this.setState({
                      motherDisease: e
                    })
                  },
                })}
              >
                <List.Item arrow="horizontal">母亲所患疾病</List.Item>
              </DicPicker>
              {
                this.state.motherDisease === '12' && <InputItem
                {...getFieldProps('mother', {
                  initialValue: detail.mother,
                })}
                >
                  其他
                </InputItem>
              }
              <DicPicker
                dic='EHR_CLI_REGISTRY_DISEASE'
                type='P'
                cols={1}
                {...getFieldProps('brotherSisterDisease', {
                  initialValue: detail.brotherSisterDisease,
                  onChange: (e)=>{
                    this.setState({
                      brotherSisterDisease: e
                    })
                  },
                })}
              >
                <List.Item arrow="horizontal">兄弟姐妹所患疾病</List.Item>
              </DicPicker>
              {
                this.state.brotherSisterDisease==='12' && <InputItem
                {...getFieldProps('brotherSister', {
                  initialValue: detail.brotherSister,
                })}
                >
                  其他
                </InputItem>
              }
              <DicPicker
                dic='EHR_CLI_REGISTRY_DISEASE'
                type='P'
                cols={1}
                {...getFieldProps('sonDaugtherDisease', {
                  initialValue: detail.sonDaugtherDisease,
                  onChange: (e)=>{
                    this.setState({
                      sonDaugtherDisease: e
                    })
                  },
                })}
              >
                <List.Item arrow="horizontal">子女所患疾病</List.Item>
              </DicPicker>
              {
                this.state.sonDaugtherDisease==='12' && <InputItem
                {...getFieldProps('sonDaugther', {
                  initialValue: detail.sonDaugther,
                })}
                >
                  其他
                </InputItem>
              }
            </div>
          }
        </form>
        </div>
      </List>
    );
  }
}

export default createForm()(MedicalInfo);
