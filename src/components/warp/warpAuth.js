import React from 'react';

const wrapAuth = ComposedComponent => class WrapComponent extends React.Component {
  render() {
    const { auth, ...other } = this.props;
    if ((sessionStorage.getItem('sys-func') || []).includes(auth) || auth === 'none') {
      return <ComposedComponent {...other} />;
    }
    return null;
  }
};
export default wrapAuth;
