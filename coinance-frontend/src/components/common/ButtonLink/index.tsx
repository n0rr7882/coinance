import React from 'react';
import { inject, observer } from 'mobx-react';
import { RouterStore } from 'mobx-react-router';
import { Button, ButtonProps } from '@material-ui/core';

interface IProps extends ButtonProps {
  routerStore?: RouterStore;
  to: string;
}

@inject('routerStore')
@observer
export default class ButtonLink extends React.Component<IProps, {}> {
  render() {
    const { routerStore, to, children, ...props } = this.props;

    return (
      <Button onClick={() => routerStore?.push(to)} {...props}>
        {children}
      </Button>
    );
  }
}