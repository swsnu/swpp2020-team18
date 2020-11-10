import React, { Fragment } from 'react'
import CustomAppBar from '../../components/details/CustomAppBar'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#f5f5f5',
  },
  title: {
    margin: 0,
    padding: '5vh',
  },
  button: {
    margin: '5vh',
  },
  test: {
    marin: 0,
  },
}))

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <Link color='inherit' href='https://material-ui.com/'>
        Term&#39;inator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

function Test() {
  const classes = useStyles()
  return (
    <Fragment>
      <CustomAppBar />
      <div className={classes.root}>
        <h1 className={classes.title}>Review Test</h1>
        <div className={classes.test}></div>
        <br></br>
        <Copyright />
        <br></br>
      </div>
    </Fragment>
  )
}

export default Test
