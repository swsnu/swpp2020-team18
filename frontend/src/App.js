import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Landing from './containers/Landing'
import Landing1 from './containers/Landing1'
import PropTypes from 'prop-types'
import SignIn from './components/accounts/SignIn'
import SignUp from './components/accounts/SignUp'
// import AccountBox from './containers/accounts/AccountBox'
import './App.css'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#ff784e',
      main: '#00bcd4',
      dark: '#b23c17',
      contrastText: '#fff',
    },
    secondary: {
      light: '#dd33fa',
      main: '#d500f9',
      dark: '#9500ae',
      contrastText: '#fff',
    },
  },
})

function App(props) {
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
                  {/* <AccountBox /> */}
                  <Landing />
                </>
              )}
            />
            <Route
              path='/terminator/article'
              exact
              render={() => (
                <>
                  {/* <AccountBox /> */}
                  <Landing1 />
                </>
              )}
            />
            <Route path='/signin' exact render={() => <SignIn />} />
            <Route path='/signup' exact render={() => <SignUp />} />
            <Redirect exact from='/' to='terminator' />
            <Route render={() => <h1>Not Found</h1>} />
          </Switch>
        </div>
      </ThemeProvider>
    </ConnectedRouter>
  )
}

App.propTypes = {
  history: PropTypes.any,
}

export default App
