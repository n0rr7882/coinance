import React, { Props } from 'react';
import { inject, observer } from 'mobx-react';
import AuthStore from '../../stores/auth';
import AppBar from '../../components/AppBar';
import { hasAuthToken } from '../../utils/token';
import LayoutStore from '../../stores/layout';

interface IProps extends Props<{}> {
  authStore?: AuthStore;
  layoutStore?: LayoutStore;
}

@inject('authStore', 'layoutStore')
@observer
export default class AppBarContainer extends React.Component<IProps, {}> {
  componentDidMount() {
    const authStore = this.props.authStore!;
    if (hasAuthToken()) authStore.verify();
  }

  render() {
    const layoutStore = this.props.layoutStore!;
    const authStore = this.props.authStore!;
    return <AppBar
      toggleLoginDialog={layoutStore.toggleLoginDialog}
      toggleRegisterDialog={layoutStore.toggleRegisterDialog}
      login={authStore.googleOauth2Login}
      logout={authStore.logout}
      logined={authStore.me ? true : false}
      status={authStore.status}
      me={authStore.me}
    />;
  }
}