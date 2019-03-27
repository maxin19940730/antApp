import { getList } from '../services/baseInfo.js'
export default {

  namespace: 'hypertensionBaseList',

  state: {
    list: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/hypertensionBaseList') {
          dispatch({
            type: 'getList',
          })
        }
      })
    },
  },

  effects: {
    *getList(action, { call, put }) {
      const data = yield call(getList)
      yield put({ type: 'save', payload: { list: data.data} })
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    }
  }

}
