import React from 'react'
import { useEffect, useState } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Landing from './containers/Landing'
import PropTypes from 'prop-types'
import SignIn from './components/accounts/SignIn'
import SignUp from './components/accounts/SignUp'
import './App.css'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import Wordlist from 'containers/wordlist/Wordlist'
import Statistics from 'containers/statistics/Statistics'
import ReviewTest from 'containers/test/ReviewTest'
import LevelTest from 'containers/test/LevelTest'
import { connect } from 'react-redux'
import * as accounts from './ducks/accounts'
import ArticleView from './containers/article/ArticleView'
import ArticleResult from './containers/article/ArticleResult'
import LevelTestResult from './containers/test/LevelTestResult'
import ReviewTestResult from './containers/test/ReviewTestResult'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#414141',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a31545',
      contrastText: '#fff',
    },
  },
})

function App(props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    // document.title = "Term'inator"
    props.getAuthentication().then(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <ConnectedRouter history={props.history}>
      <ThemeProvider theme={theme}>
        <div className='App'>
          <Switch>
            <Route
              path='/'
              exact
              render={() => (
                <>
                  <Landing />
                </>
              )}
            />
            <Route
              path='/wordlist'
              exact
              render={() => (
                <>
                  <Wordlist />
                </>
              )}
            />
            <Route
              path='/reviewtest'
              exact
              render={() => (
                <>
                  <ReviewTest />
                </>
              )}
            />
            <Route
              path='/reviewtest/result'
              exact
              component={ReviewTestResult}
            />
            <Route
              path='/leveltest'
              exact
              render={() => (
                <>
                  <LevelTest />
                </>
              )}
            />
            <Route path='/leveltest/result' exact component={LevelTestResult} />
            <Route
              path='/statistics'
              exact
              render={() => (
                <>
                  <Statistics />
                </>
              )}
            />
            <Route path='/signin' exact render={() => <SignIn />} />
            <Route path='/signup' exact render={() => <SignUp />} />
            <Route path='/article/:id' exact component={ArticleView} />
            <Route path='/article/:id/result' exact component={ArticleResult} />
            <Redirect exact from='/' to='terminator' />
            <Route render={() => <h1>Not Found</h1>} />
          </Switch>
        </div>
      </ThemeProvider>
    </ConnectedRouter>
  )
}

const mapStateToProps = (state) => ({
  user: state.accounts.user,
})

const mapDispatchToProps = (dispatch) => ({
  getAuthentication: () => dispatch(accounts.checkLogin()),
})

App.propTypes = {
  history: PropTypes.any,
  user: PropTypes.object,
  getAuthentication: PropTypes.func,
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
