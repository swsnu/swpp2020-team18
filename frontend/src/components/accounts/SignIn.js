import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Alert from '@material-ui/lab/Alert'
import SchoolIcon from '@material-ui/icons/School'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useState } from 'react'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import Copyright from '../details/Copyright'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
}))

function SignIn(props) {
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const submitHandler = () => {
    console.log('Submit')
    props.onSignIn({ email: email, password: password })
  }

  if (props.user) {
    return <Redirect to='/' />
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SchoolIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <div className={classes.form}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email Address'
            name='email'
            autoComplete='username'
            autoFocus
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={submitHandler}
          >
            Sign In
          </Button>
          {props.error_message && (
            <Alert severity='error'>{props.error_message}</Alert>
          )}
          {message && <Alert severity='info'>{message}</Alert>}
          <Grid container>
            <Grid item xs>
              <Link
                onClick={() =>
                  setMessage('Please send email to sjosjo1204@gmail.com')
                }
                variant='body2'
              >
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='/signup' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  error_message: state.accounts.error_message,
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => ({
  onSignIn: (accountInfo) => dispatch(accounts.signIn(accountInfo)),
})

SignIn.propTypes = {
  user: PropTypes.object,
  error_message: PropTypes.string,
  onSignIn: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
