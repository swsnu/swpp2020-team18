import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Landing from './containers/Landing'
import PropTypes from 'prop-types'

function App(props) {
  return (
    <ConnectedRouter history={props.history}>
      <div className='App'>
        <Switch>
          <Route path='/terminator' exact render={() => <Landing />} />
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
