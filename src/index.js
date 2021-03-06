import dva from 'dva'
import createLoading from 'dva-loading';
import  '../public/fonts/iconfont/iconfont.js';
// 1. Initialize
const app = dva();

// 2. Plugins
app.use(createLoading())

// 3. Model
// app.model(require('./models/appState').default)

// 4. Router
app.router(require('./router').default)

// 5. Start
app.start('#root')
export default app._store;  // eslint-disable-line