import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import logoImage from '../../images/logo.png'
import Toolbar from '@material-ui/core/Toolbar'
import * as accounts from '../../ducks/accounts'
import PropTypes from 'prop-types'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  logoutButton: {
    Right: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  logo: {
    marginRight: theme.spacing(2),
    maxWidth: 160,
  },
}))

function CustomAppBar(props) {
  const classes = useStyles()
  const history = useHistory()

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
          <img
            src={logoImage}
            alt='terminator'
            className={classes.logo}
            onClick={() => history.push('/terminator')}
          />
          <Typography variant='h6' className={classes.title}></Typography>
          <Button
            className={classes.logoutButton}
            color='inherit'
            onClick={() => props.onSignOut()}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
  onSignOut: () => dispatch(accounts.signOut()),
})

CustomAppBar.propTypes = {
  onSignOut: PropTypes.func,
  history: PropTypes.any,
}

export default connect(null, mapDispatchToProps)(CustomAppBar)
