import React from 'react'
import { connect } from 'dva'
import { createForm } from 'rc-form';
import styles from '../../router.less'
import userImg from './user.png'
import {
  List,
  InputItem,
  Switch,
  WingBlank,
  Button,
  WhiteSpace,
  Flex,
  Icon,
  Toast,
} from 'antd-mobile'
      



class Login extends React.Component {
  constructor() {
    super()
    this.state = {
      scroller: '',
      modalVisible: false,
      selectId: '',
      open: true,
    }
  }


  render() {
    const { getFieldProps, getFieldError, validateFields }=this.props.form
    return <div className={styles.loginDiv}>
      <WingBlank className={styles.loginDivCenter}>
        <WingBlank size="lg">
        <Flex direction="column">
          <Flex.Item className={styles.systemTitle}>
            <WhiteSpace size="lg" />
              <div className={styles.title}>健康档案管理系统</div>
              <div className={styles.describe}>Health Records Management System</div>
          </Flex.Item>
          <Flex.Item className={styles.systemTitle}>
            <WhiteSpace size="lg" />
            <img alt="" src={userImg} style={{ width: 130 }}/>
            <WhiteSpace size="lg" />
          </Flex.Item>
        </Flex>
        </WingBlank>
        <form className={styles.loginFrom}>
          <List>
            <InputItem
            className={styles.loginItem}
              {...getFieldProps('username',{
                rules: [
                  {
                    required: true,
                    message: '必填'
                  },
                ],
              })}
              placeholder="登录用户"
              clear={true}
              error={!!getFieldError('username')}
              onErrorClick={()=>{
                Toast.info(getFieldError('username'), 1)
              }}
            >
              <Icon type="mingpian" color='#aaa'/>
            </InputItem>
            <InputItem
              className={styles.loginItem}
              {...getFieldProps('password',{
                rules: [
                  {
                    required: true,
                    message: '必填'
                  },
                ],
              })}
              placeholder="登录密码"
              clear={true}
              type={!!this.state.checked ? '' : 'password'}
              extra={<Switch
                className={'cc'}
                checked={this.state.checked}
                onChange={() => {
                  this.setState({
                    checked: !this.state.checked,
                  });
                }}
              />}
              error={!!getFieldError('password')}
              onErrorClick={()=>{
                Toast.info(getFieldError('password'), 1)
              }}
            >
              <Icon type="mima01" color='#aaa'/>
            </InputItem>
          </List>
          <WhiteSpace size="lg" />
          <div className={styles.forgetPass}>
            <span>忘记密码</span>
          </div>
          <WhiteSpace size="lg" />
          
        </form>
        <Button className={styles.loginButton} loading={this.props.loginLoading} disabled={this.props.loginLoading} onClick={()=>{
            validateFields((errors, values) => {
              if (errors) {
                return
              }else{
                this.props.dispatch({
                  type: 'login/loginIn',
                  params:{
                    ...values,
                  }
                })
              }
            })
          }}>登录</Button>
      </WingBlank>
    </div>
    
  }
}

function mapStateToProps({ login, loading }) {
  return { 
    ...login,
    loginLoading: loading.effects['login/loginIn']
  }
}

export default connect(mapStateToProps)(createForm()(Login));
