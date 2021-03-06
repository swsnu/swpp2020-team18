import React, { Fragment } from 'react'
import CustomAppBar from '../../components/details/CustomAppBar'
import WordTable from './WordTable'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { useHistory, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Copyright from '../../components/details/Copyright'

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: '#f5f5f5',
    height: '120vh',
  },
  title: {
    margin: 0,
    padding: '5vh',
  },
  button: {
    margin: '5vh',
  },
}))

function Wordlist(props) {
  const classes = useStyles()
  const history = useHistory()

  if (!props.user) {
    return <Redirect to='/signin' />
  }

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
          onClick={() => history.push('/reviewtest')}
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

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

Wordlist.propTypes = {
  user: PropTypes.object,
}

export default connect(mapStateToProps, null)(Wordlist)
