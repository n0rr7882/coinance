import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, Tooltip, CircularProgress, IconButton, Menu, MenuItem } from '@material-ui/core';
import { AccountCircle, VpnKey, FormatListNumbered, MultilineChart } from '@material-ui/icons';
import GoogleLogin from 'react-google-login';
import { User } from '../../models/user';
import { Status } from '../../models/common';
import { GOOGLE_OAUTH2_CLIENT_ID } from '../../constants';
import UserSettingDialogContainer from '../../containers/UserSettingDialogContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    spacer: {
      flexGrow: 1,
    },
    title: {
      fontWeight: 900,
      fontFamily: 'Orbitron',
    },
    logoutButton: {
      color: theme.palette.error.main,
    }
  }),
);

interface IProps {
  toggleLoginDialog: () => void;
  toggleRegisterDialog: () => void;
  login: (code: string) => void;
  logout: () => void;
  logined: boolean;
  status: Status;
  me?: User;
}

const AppBar: React.FC<IProps> = props => {
  const classes = useStyles();
  const [userMenuanchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const login = (data: any) => props.login(data.code);
  const logout = () => {
    setUserMenuAnchorEl(null);
    props.logout()
  };

  const UserButton = (
    <>
      <Button
        size="small" color="inherit" variant="outlined" startIcon={<AccountCircle />}
        onClick={e => setUserMenuAnchorEl(e.currentTarget)}
      >
        {props.me?.first_name}{props.me?.last_name}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={userMenuanchorEl}
        keepMounted
        open={Boolean(userMenuanchorEl)}
        onClose={() => setUserMenuAnchorEl(null)}
      >
        <Link to='/mypage'>
          <MenuItem onClick={() => setUserMenuAnchorEl(null)}>마이페이지</MenuItem>
        </Link>
        <MenuItem onClick={logout} className={classes.logoutButton}>로그아웃</MenuItem>
      </Menu>
      {!!props.me?.setting ? <UserSettingDialogContainer /> : undefined}
    </>
  );

  const LoginButton = (
    <GoogleLogin
      render={props => (
        <Tooltip title="Google 계정으로 로그인하기">
          <span>
            <Button
              size="small" color="inherit" variant="outlined" startIcon={<VpnKey />}
              onClick={props.onClick} disabled={props.disabled}
            >로그인</Button>
          </span>
        </Tooltip>
      )}
      clientId={GOOGLE_OAUTH2_CLIENT_ID}
      onSuccess={login}
      onFailure={console.error}
      responseType="code"
      accessType="offline"
    />
  );

  const AppBarButton = props.logined ? UserButton : LoginButton;

  return (
    <div className={classes.root}>
      <MuiAppBar position="fixed">
        <Toolbar variant="dense">
          <Typography variant="h6" className={classes.title}>
            coinance
          </Typography>
          <span className={classes.spacer} />
          <Link to='/'>
            <Tooltip title="거래소 홈">
              <IconButton color="inherit" size="small" className={classes.menuButton}><MultilineChart /></IconButton>
            </Tooltip>
          </Link>
          <Link to='/ranking'>
            <Tooltip title="랭킹">
              <IconButton color="inherit" size="small" className={classes.menuButton}><FormatListNumbered /></IconButton>
            </Tooltip>
          </Link>
          {props.status === Status.pending
            ? <CircularProgress color="inherit" size={24} />
            : AppBarButton}
        </Toolbar>
      </MuiAppBar>
    </div >
  );
}

export default AppBar;