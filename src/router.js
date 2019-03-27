import React from 'react'
import { Router, Route, Switch } from 'dva/router'
import { getRouterData } from './common/router';

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  let arr=[]
  for (const key in routerData) {
    if (routerData.hasOwnProperty(key)) {
      arr.push(<Route path={key} key={key} exact component={routerData[key].component} />)
    }
  }
  return (
    <Router history={history}>
      <div>
        <Switch>
          {arr}
        </Switch>
      </div>
    </Router>
  )
}


export default RouterConfig
