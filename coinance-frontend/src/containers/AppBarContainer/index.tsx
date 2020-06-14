import React from "react";
import { inject, observer } from "mobx-react";
import AuthStore from "../../stores/auth";
import AppBar from "../../components/AppBar";
import { hasAuthToken } from "../../utils/token";
import LayoutStore from "../../stores/layout";
import OrderStore from "../../stores/order";
import { Status } from "../../models/common";
import WalletStore from "../../stores/wallet";

interface Props {
  authStore?: AuthStore;
  orderStore?: OrderStore;
  walletStore?: WalletStore;
  layoutStore?: LayoutStore;
}

@inject("authStore", "orderStore", "walletStore", "layoutStore")
@observer
export default class AppBarContainer extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async componentDidMount() {
    if (hasAuthToken()) {
      const authStore = this.props.authStore!;
      await authStore.verify();

      if (authStore.status === Status.done) {
        const orderStore = this.props.orderStore!;
        const walletStore = this.props.walletStore!;
        orderStore.subscribe();
        walletStore.subscribe();
      }
    }
  }

  async componentWillUnmount() {
    const authStore = this.props.authStore!;

    if (authStore.me) {
      const orderStore = this.props.orderStore!;
      const walletStore = this.props.walletStore!;
      orderStore.unsubscribe(authStore.me);
      walletStore.unsubscribe(authStore.me);
    }
  }

  private async login(code: string) {
    const authStore = this.props.authStore!;
    const orderStore = this.props.orderStore!;
    const walletStore = this.props.walletStore!;

    await authStore.googleOauth2Login(code);
    orderStore.subscribe();
    walletStore.subscribe();
  }

  private async logout() {
    const authStore = this.props.authStore!;
    const orderStore = this.props.orderStore!;
    const walletStore = this.props.walletStore!;

    orderStore.unsubscribe(authStore.me!);
    walletStore.unsubscribe(authStore.me!);
    authStore.logout();
  }

  render() {
    const layoutStore = this.props.layoutStore!;
    const authStore = this.props.authStore!;
    return (
      <AppBar
        login={this.login}
        logout={this.logout}
        toggleUserSettingDialog={layoutStore.toggleUserSettingDialog}
        logined={authStore.me ? true : false}
        status={authStore.status}
        me={authStore.me}
      />
    );
  }
}
