import React from 'react';
import { inject, observer } from 'mobx-react';
import AuthStore from '../../../stores/auth';
import { RouteProps, Redirect, Route } from 'react-router';

interface Props extends RouteProps {
  authStore?: AuthStore;
}

const AuthenticatedRoute: React.FC<Props> = inject('authStore')(observer(({ authStore, ...props }) => {
  const { render, component: Component, ...rest } = props;

  const settingCompletedUserLoggedIn = !!authStore?.me?.setting.id;

  const redirect = () => (
    <Redirect
      to={{ pathname: "/", state: { from: props.location } }}
    />
  );

  return (
    <Route
      {...rest}
      render={render && (settingCompletedUserLoggedIn ? render : redirect)}
      component={Component && (settingCompletedUserLoggedIn ? Component : redirect)}
    />
  );
}));

export default AuthenticatedRoute;