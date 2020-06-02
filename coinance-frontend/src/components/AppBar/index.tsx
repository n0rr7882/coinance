import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Button, Tooltip, CircularProgress, IconButton, Menu, MenuItem, ListItemIcon } from '@material-ui/core';
import { Home, Tune, ExitToApp, AssessmentOutlined, ListAltOutlined, SettingsBrightnessOutlined, VpnKeyOutlined, AccountBoxOutlined } from '@material-ui/icons';
import GoogleLogin from 'react-google-login';
import { User } from '../../models/user';
import { Status } from '../../models/common';
import { GOOGLE_OAUTH2_CLIENT_ID } from '../../constants';
import UserSettingDialogContainer from '../../containers/UserSettingDialogContainer';
import { switchPaletteType, getPaletteType } from '../../utils/theme';
import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      borderBottom: `5px solid ${theme.palette.primary.main}`,
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

interface Props {
  login: (code: string) => void;
  logout: () => void;
  toggleUserSettingDialog: () => void;
  logined: boolean;
  status: Status;
  me?: User;
}

const AppBar: React.FC<Props> = props => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [userMenuanchorEl, setUserMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const login = (data: any) => props.login(data.code);
  const logout = () => {
    setUserMenuAnchorEl(null);
    props.logout()
  };
  const toggleUserSettingDialog = () => {
    setUserMenuAnchorEl(null);
    props.toggleUserSettingDialog();
  }

  const userButton = (
    <>
      <Button
        variant="outlined"
        size="small"
        color="inherit"
        startIcon={<AccountBoxOutlined />}
        onClick={e => setUserMenuAnchorEl(e.currentTarget)}
      >
        {props.me?.setting.nickname || '환영합니다!'}
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={userMenuanchorEl}
        keepMounted
        open={Boolean(userMenuanchorEl)}
        onClose={() => setUserMenuAnchorEl(null)}
      >
        <Link to='/mypage'>
          <MenuItem onClick={() => setUserMenuAnchorEl(null)}>
            <ListItemIcon>
              <Home fontSize="small" />
            </ListItemIcon>
            <Typography variant="inherit">마이페이지</Typography>
          </MenuItem>
        </Link>
        <MenuItem onClick={toggleUserSettingDialog}>
          <ListItemIcon>
            <Tune fontSize="small" />
          </ListItemIcon>
          <Typography variant="inherit">사용자 설정</Typography>
        </MenuItem>
        <MenuItem onClick={logout} className={classes.logoutButton}>
          <ListItemIcon>
            <ExitToApp fontSize="small" className={classes.logoutButton} />
          </ListItemIcon>
          <Typography variant="inherit">로그아웃</Typography>
        </MenuItem>
      </Menu>
      <UserSettingDialogContainer />
    </>
  );

  const loginButton = (
    <GoogleLogin
      render={props => (
        <Tooltip title="Google 계정으로 로그인하기">
          <span>
            <Button
              variant="outlined"
              size="small"
              color="inherit"
              startIcon={<VpnKeyOutlined />}
              onClick={props.onClick}
              disabled={props.disabled}
            >Google 계정으로 로그인</Button>
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

  const appBarButton = props.logined ? userButton : loginButton;

  const switchTheme = () => {
    switchPaletteType();
    enqueueSnackbar(`테마가 ${getPaletteType()} 모드로 변경되었습니다. refresh 시 반영됩니다.`);
  }

  return (
    <div className={classes.root}>
      <MuiAppBar
        className={classes.appBar}
        color="inherit"
        position="fixed"
        elevation={0}
      >
        <Toolbar variant="dense">
          <Link to='/'>
            <Typography variant="h6" className={classes.title}>
              coinance
            </Typography>
          </Link>
          <span className={classes.spacer} />
          <Link to='/'>
            <Tooltip title="거래소 홈">
              <IconButton color="inherit" size="small" className={classes.menuButton}>
                <AssessmentOutlined />
              </IconButton>
            </Tooltip>
          </Link>
          <Link to='/ranking'>
            <Tooltip title="랭킹">
              <IconButton color="inherit" size="small" className={classes.menuButton}>
                <ListAltOutlined />
              </IconButton>
            </Tooltip>
          </Link>
          <Tooltip title="테마 변경">
            <IconButton color="inherit" size="small" className={classes.menuButton} onClick={switchTheme}>
              <SettingsBrightnessOutlined />
            </IconButton>
          </Tooltip>
          {props.status === Status.pending
            ? <CircularProgress color="inherit" size={24} />
            : appBarButton}
        </Toolbar>
      </MuiAppBar>
    </div >
  );
}

export default AppBar;