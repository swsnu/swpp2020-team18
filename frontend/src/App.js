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
import Article from 'containers/article/Article'
import Wordlist from 'containers/wordlist/Wordlist'
import Statistics from 'containers/statistics/Statistics'
import Test from 'containers/test/Test'
import { connect } from 'react-redux'
import * as accounts from './ducks/accounts'
import ArticleView from './containers/article/ArticleView'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#414141',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f5f5f5',
      contrastText: '#fff',
    },
  },
})

function App(props) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    props.getAuthentication().then(() => setLoading(false))
  }, [])

  if (loading) return null

  return (
    <ConnectedRouter history={props.history}>
      <ThemeProvider theme={theme}>
        <div className='App'>
          <Switch>
            <Route
              path='/terminator'
              exact
              render={() => (
                <>
                  <Landing />
                </>
              )}
            />
            <Route
              path='/terminator/article'
              exact
              render={() => (
                <>
                  <Article />
                </>
              )}
            />
            <Route
              path='/terminator/wordlist'
              exact
              render={() => (
                <>
                  <Wordlist />
                </>
              )}
            />
            <Route
              path='/terminator/test'
              exact
              render={() => (
                <>
                  <Test />
                </>
              )}
            />
            <Route
              path='/terminator/statistics'
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
