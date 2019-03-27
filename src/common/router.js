import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) => (
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  })
);

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach((model) => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return (props) => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () => models.filter(
      model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)
    ),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then((raw) => {
        const Component = raw.default || raw;
        return props => createElement(Component, {
          ...props,
          routerData: routerDataCache,
        });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerConfig = {
    '/home': {
      component: dynamicWrapper(app, ['home'], () => import('../routes/home')),
    },
    '/baseInfoFrom/:id': {
      component: dynamicWrapper(app, ['baseInfo'], () => import('../routes/baseInfoFrom')),
    },
    '/baseInfoFrom': {
      component: dynamicWrapper(app, ['baseInfo'], () => import('../routes/baseInfoFrom')),
    },
    '/test': {
      component: dynamicWrapper(app, ['appState'], () => import('../routes/fromTest')),
    },
    '/baseInfoList': {
      component: dynamicWrapper(app, ['baseInfo'], () => import('../routes/baseInfoList')),
    },
    '/hypertensionBaseList': {
      component: dynamicWrapper(app, ['hypertension'], () => import('../routes/hypertensionBaseList')),
    },
    '/hypertensionList': {
      component: dynamicWrapper(app, ['hypertension'], () => import('../routes/hypertensionList')),
    },
    '/hypertensionFrom': {
      component: dynamicWrapper(app, ['hypertension'], () => import('../routes/hypertensionFrom')),
    },
    '/baseInfoDetail': {
      component: dynamicWrapper(app, ['baseInfo'], () => import('../routes/baseInfoFrom/baseInfoDetail')),
    },
    '/hypertensionDetail': {
      component: dynamicWrapper(app, ['hypertension'], () => import('../routes/hypertensionFrom/hypertensionDetail')),
    },
    '/': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/login')),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach((path) => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`/${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
