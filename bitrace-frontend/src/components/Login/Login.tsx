import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { Theme, createStyles } from '@material-ui/core/styles';
import Copyright from '../Copyright';
import { inject, observer } from 'mobx-react';
import LoginFormStore from '../../stores/forms/login';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';

const stylesDeclerations = (theme: Theme) => createStyles({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

const stylesInjector = withStyles(stylesDeclerations);

interface IProps extends WithStyles<typeof stylesDeclerations> {
  loginForm?: LoginFormStore;
}

@inject('loginForm')
@observer
class Login extends React.Component<IProps, {}> {

  render() {
    const classes = this.props.classes;
    const loginForm = this.props.loginForm as LoginFormStore;

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>

          <div className={classes.paper}>

            <Avatar className={classes.avatar}><LockOutlinedIcon /></Avatar>
            <Typography component="h1" variant="h5">BiTrace 로그인</Typography>

            <form className={classes.form} noValidate>

              <TextField
                autoFocus
                required
                fullWidth
                variant="outlined"
                margin="normal"
                name="username"
                id="username"
                label="사용자 이름"
                value={loginForm.form.fields.username.value}
                onChange={e => loginForm.onFieldChange('username', e.target.value)}
              />
              <TextField
                required
                fullWidth
                variant="outlined"
                margin="normal"
                type="password"
                name="password"
                id="password"
                label="패스워드"
                value={loginForm.form.fields.password.value}
                onChange={e => loginForm.onFieldChange('password', e.target.value)}
              />
              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                className={classes.submit}>
                로그인
              </Button>

            </form>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">패스워드를 잊어버렸어요.:(</Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">계정이 없어요. 계정을 등록할래요!</Link>
              </Grid>
            </Grid>

            <Box mt={5}>
              <Copyright />
            </Box>

          </div>
        </Grid>
      </Grid>
    );
  }
}

export default stylesInjector(Login);
