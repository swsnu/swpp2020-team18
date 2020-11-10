import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import SchoolIcon from '@material-ui/icons/School'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='/'>
        Term&#39;inator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

function SignUp(props) {
  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')

  const submitHandler = () => {
    console.log('Submit')
    props.onSignUp({ email: email, username: username, password: password })
  }

  if (props.user) {
    return <Redirect to='/leveltest' />
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <SchoolIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Sign up
        </Typography>
        <div className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='username'
                label='Username'
                name='username'
                autoComplete='nickname'
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='username'
                onChange={(event) => setEmail(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant='outlined'
                required
                fullWidth
                name='password'
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
            onClick={submitHandler}
          >
            Sign Up
          </Button>
          <Grid container justify='flex-end'>
            <Grid item>
              <Link href='/signin' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => ({
  onSignUp: (accountInfo) => dispatch(accounts.signUp(accountInfo)),
})

SignUp.propTypes = {
  user: PropTypes.object,
  onSignUp: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
