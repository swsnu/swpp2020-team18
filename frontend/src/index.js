import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import penderMiddleware from 'redux-pender'
import accountsReducer from './ducks/accounts'
import wordlistReducer from './ducks/wordlist'
import articleReducer from './ducks/article'
import wordtestReducer from './ducks/wordtest'
import './index.css'

const history = createBrowserHistory()

const rootReducer = combineReducers({
  accounts: accountsReducer,
  wordlist: wordlistReducer,
  article: articleReducer,
  wordtest: wordtestReducer,
  router: connectRouter(history),
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(thunk, routerMiddleware(history), penderMiddleware())
  )
)

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
