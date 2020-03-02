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
import { makeStyles } from '@material-ui/core/styles';
import Copyright from '../Copyright';

const useStyles = makeStyles(theme => ({
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
}));

export default function Register() {
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            BiTrace 계정 생성하기
          </Typography>
          <form className={classes.form} noValidate>
            <TextField variant="outlined" margin="normal" required fullWidth id="username" label="사용자 이름" name="username" autoFocus />
            <Grid container spacing={3}>
              <Grid item xs>
                <TextField variant="outlined" margin="normal" required fullWidth id="last-name" label="성" name="last_name" />
              </Grid>
              <Grid item xs>
                <TextField variant="outlined" margin="normal" required fullWidth id="first-name" label="이름" name="first_name" />
              </Grid>
            </Grid>
            <TextField variant="outlined" margin="normal" required fullWidth id="email" label="이메일" type="email" name="email" />
            <TextField variant="outlined" margin="normal" required fullWidth id="password" label="패스워드" type="password" name="password" />
            <TextField variant="outlined" margin="normal" required fullWidth id="password" label="패스워드 확인" type="password" name="password" />
            <Button size="large" type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>계정 생성</Button>
            <Grid container>
              <Grid item>
                <Link href="#" variant="body2">계정이 이미 있어요. 로그인할래요!</Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}