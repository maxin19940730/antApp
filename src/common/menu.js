// import { isUrl } from '../utils/utils';

const menuData = [{
  name: '领导驾驶舱',
  icon: 'dashboard',
  path: 'dashboard',
  children: [{
    name: '分析页',
    path: 'analysis',
  }, {
    name: '监控页',
    path: 'monitor',
  }, {
    name: '工作台',
    path: 'workplace',
    // hideInMenu: true,
  }],
},
{
  name: '指标库管理',
  icon: 'database',
  path: '',
  children: [
    {
      name: '指标库管理',
      path: 'idxdb',
    }, {
      name: '指标分类',
      path: 'idxcatlog',
    }, {
      name: '指标管理',
      path: 'idxmgr',
    }, {
      name: '数据来源管理',
      path: 'dsmgr',
    }],
},
{
  name: '系统管理',
  icon: 'setting',
  path: '',
  children: [{
    name: '用户管理',
    path: 'usermgr',
  }, {
    name: '角色管理',
    path: 'role',
  }, {
    name: '机构管理',
    path: 'org',
  }, {
    name: '字典管理',
    path: 'dictionary',
  }],
}];

export function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    // if (!isUrl(path)) {
      path = parentPath + item.path;
    // }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
