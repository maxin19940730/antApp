import { login } from '../services/login.js'
import store from '../index';
import { routerRedux } from 'dva/router';
import {
  Toast,
} from 'antd-mobile'

const { dispatch } = store
export default {

  namespace: 'login',

  state: {
    
  },

  effects: {
    *loginIn({ params }, { call }) {
      const data = yield call(login, params)
      if(data.state==='SUCCESS' && data.ret && data.ret.flag==='1'){
        sessionStorage.setItem('user',JSON.stringify(data.ret))
        Toast.success('登陆成功', 1);
        setTimeout(()=>{
          dispatch(routerRedux.push('/home'));
        },1000)
      }else{
        Toast.fail('登陆失败', 1);
      }
    },
  },

  reducers: {
    default (state, action) {
      return { ...state, ...action }
    },
  }

}
