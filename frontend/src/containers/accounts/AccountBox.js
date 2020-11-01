import React from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import * as accounts from '../../ducks/accounts'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
// import { makeStyles } from '@material-ui/core/styles'
// import Grid from '@material-ui/core/Grid'
// import Paper from '@material-ui/core/Paper';
//import { Redirect } from 'react-router-dom';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

function AccountBox(props) {
  // const classes = useStyles()

  if (props.user) {
    return (
      <ButtonGroup
        orientation='vertical'
        color='primary'
        aria-label='vertical outlined primary button group'
      >
        <Button
          variant='outlined'
          color='primary'
          onClick={() =>
            window.alert('TODO: Redirect to personal setting page or stats page')
          }
        >
          {props.user.username}
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={() => props.onSignOut()}
        >
          Sign Out
        </Button>
      </ButtonGroup>
    )
  } else {
    return (
      <Button
        variant='contained'
        color='primary'
        onClick={() => props.history.push('/signin')}
      >
        Sign In
      </Button>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => ({
  onSignOut: () => dispatch(accounts.signOut()),
})

AccountBox.propTypes = {
  user: PropTypes.object,
  onSignOut: PropTypes.func,
  history: PropTypes.any,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountBox))
