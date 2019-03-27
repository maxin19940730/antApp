import { del, getDetail, getBaseList, getHList, addHypertension, updateHypertension } from '../services/hypertension.js'
import store from '../index';
import { routerRedux } from 'dva/router';
import {
  Toast,
} from 'antd-mobile'
const { dispatch } = store
//高血压相关数据
export default {

  namespace: 'hypertension',

  state: {
    list: [],
    Hlist: [],
    modalType: 'create',
    detail: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/hypertensionFrom' || location.pathname === '/hypertensionDetail') {
          if(location.query && location.query.visitId){
            dispatch({
              type: 'getDetail',
              payload:{
                visitId: location.query.visitId,
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
      // history.listen((location) => {
      //   if (location.pathname === '/hypertensionList') {
      //     dispatch({
      //       type: 'getList',
      //     })
      //   }
      // })
    },
  },

  effects: {
    *getList({ params }, { call, put, select }) {
      const data = yield call(getBaseList, params)
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
    *getHList({ params }, { call, put, select }) {
      let id = yield select(_ => _.hypertension.ehrId)
      let ehrId = params.ehrId? params.ehrId: id
      const data = yield call(getHList, {...params, ehrId})
      if(data.state==='SUCCESS'){
        yield put({ 
          type: 'save',
          payload: { 
            Hlist: data.ret || [],
            pagination: {
              total: data.count ? Math.floor(data.count/10) : 1,
              current: params.page || 1,
            },
            ...params,
          } 
        })
        !params.nojump && dispatch(routerRedux.push('/hypertensionList'));
      }
    },
    *add({ params }, { call, put, select }) {
      let ehrId = yield select(_ => _.hypertension.ehrId)
      const data = yield call(addHypertension, params)
      if(data.state==='SUCCESS'){
        Toast.success('新增成功', 1);
        yield put({
          type: 'getHList',
          params: {
            page: 1,
            limit: 10,
            ehrId,
          }
        })
      }else{
        Toast.fail('新增失败', 1);
      }
    },

    *update({ params }, { call, put, select }) {
      let ehrId = yield select(_ => _.hypertension.ehrId)
      const data = yield call(updateHypertension, params)
      if(data.state==='SUCCESS'){
        Toast.success('修改成功', 1);
        yield put({
          type: 'getHList',
          params: {
            page: 1,
            limit: 10,
            ehrId,
          }
        })
      }else{
        Toast.fail('修改失败', 1);
      }
    },
    *getDetail({ payload }, { call, put }) {
      const data = yield call(getDetail, { visitId: payload.visitId })
      if(data.state==='SUCCESS'){
        yield put({ type: 'save', payload: { detail: data.ret, ...payload} })
      }
    },
    *del({ payload }, { call, put, select }) {
      let ehrId = yield select(_ => _.hypertension.ehrId)
      const data = yield call(del, { visitId: payload.visitId })
      if(data.state==='SUCCESS'){
        Toast.success('删除成功', 1);
        yield put({
          type: 'getHList',
          params: {
            page: 1,
            limit: 10,
            ehrId,
            nojump: true
          }
        })
      }else{
        Toast.fail('删除失败', 1);
      }
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    }
  }

}
