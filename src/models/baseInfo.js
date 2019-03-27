import { getDetail, addBaseInfo, updateBaseInfo, delBaseInfo, getList } from '../services/baseInfo.js'
import store from '../index';
import { routerRedux } from 'dva/router';
import {
  Toast,
} from 'antd-mobile'

const { dispatch } = store
export default {

  namespace: 'baseInfo',

  state: {
    list: [],
    pagination: {
      total: 1,
      current: 1,
    },
    detail: {},
    modalType: 'create',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/baseInfoFrom' || location.pathname === '/baseInfoDetail') {
          if(location.query && location.query.ehrId){
            dispatch({
              type: 'getDetail',
              payload:{
                ehrId: location.query.ehrId,
                modalType: 'update'
              }
            })
          }else{
            dispatch({
              type: 'save',
              payload:{
                modalType: 'create',
                detail: {},
              }
            })
          }
        }
      })
    },
  },

  effects: {
    *getList({ params }, { call, put, select }) {
      const data = yield call(getList, params)
      if(data.state==='SUCCESS'){
        yield put({ 
          type: 'save',
          payload: { 
            list: data.ret || [],
            pagination: {
              total: data.count ? Math.floor(data.count/10) : 1,
              current: params.page || 1,
            }
          } 
        })
      }
    },
    *del({ payload }, { call, put }) {
      const data = yield call(delBaseInfo, { ehrId: payload.ehrId })
      if(data.state==='SUCCESS'){
        Toast.success('删除成功', 1);
        yield put({
          type: 'getList',
          params: {
            page: 1,
            limit: 10,
          }
        })
      }else{
        Toast.fail('删除失败', 1);
      }
    },
    *getDetail({ payload }, { call, put }) {
      const data = yield call(getDetail, { ehrId: payload.ehrId })
      if(data.state==='SUCCESS'){
        yield put({ type: 'save', payload: { detail: data.ret, ...payload} })
      }
    },
    *add({ params }, { call, put }) {
      const data = yield call(addBaseInfo, params)
      if(data.state==='SUCCESS'){
        Toast.success('新增成功', 1);
        setTimeout(()=>{
          dispatch(routerRedux.push('/baseInfoList'));
        },1000)
      }else{
        Toast.fail('新增失败', 1);
      }
    },

    *update({ params }, { call, put }) {
      const data = yield call(updateBaseInfo, params)
      if(data.state==='SUCCESS'){
        Toast.success('修改成功', 1);
        setTimeout(()=>{
          dispatch(routerRedux.push('/baseInfoList'));
        },1000)
      }else{
        Toast.fail('修改失败', 1);
      }
    },

    
},

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    }
  }

}
