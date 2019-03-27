
export default {

  namespace: 'home',

  state: {
  },

  subscriptions: {
    setup({ dispatch, history }) {
      //初始加载数据
      //dispatch({ type: 'getDefaultInfo' })
      //dispatch({ type: 'getBanner' })
    },
  },

  effects: {
    
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload }
    },
    updateNews(state, action) {
      return { ...state, ...{ pageIndex: state.pageIndex + 1, newsList: state.newsList.concat(action.payload.newsList) } }
    }

  }

}
