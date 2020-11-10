import React, { Fragment } from 'react'
import CustomAppBar from '../../components/details/CustomAppBar'
import WordTable from './WordTable'
import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'

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

function Wordlist() {
  const classes = useStyles()
  const history = useHistory()
  return (
    <Fragment>
      <CustomAppBar />
      <div className={classes.root}>
        <h1 className={classes.title}>Wordlist</h1>
        <WordTable />
        <Button
          variant='contained'
          color='primary'
          className={classes.button}
          onClick={() => history.push('/terminator/test')}
        >
          Review Test
        </Button>
        <br></br>
        <Copyright />
        <br></br>
      </div>
    </Fragment>
  )
}

export default Wordlist
