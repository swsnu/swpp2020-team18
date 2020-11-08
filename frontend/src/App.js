import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Landing from './containers/Landing'
import PropTypes from 'prop-types'
import SignIn from './components/accounts/SignIn'
import SignUp from './components/accounts/SignUp'
import AccountBox from './containers/accounts/AccountBox'
import ArticleView from './containers/article/ArticleView'

function App(props) {
  return (
    <ConnectedRouter history={props.history}>
      <div className='App'>
        <Switch>
          <Route
            path='/terminator'
            exact
            render={() => (
              <>
                <AccountBox />
                <Landing />
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
    </ConnectedRouter>
  )
}

App.propTypes = {
  history: PropTypes.any,
}

export default App
