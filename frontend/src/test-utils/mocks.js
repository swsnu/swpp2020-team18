import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import penderMiddleware from 'redux-pender'
// import accountsReducer from '../ducks/accounts'
// import * as actionCreators from '../ducks/accounts';

const getMockReducer = jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break
    }
    return state
  }
)

export const getMockStore = (initialState) => {
  const mockReducer = getMockReducer(initialState)
  const rootReducer = combineReducers({
    accounts: mockReducer,
    article: mockReducer,
    wordlist: mockReducer,
    wordtest: mockReducer,
    router: connectRouter(history),
  })
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const mockStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  return mockStore
}

export const history = createBrowserHistory()

export const middlewares = [thunk, routerMiddleware(history), penderMiddleware()]
