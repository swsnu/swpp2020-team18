import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { connectRouter, routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import penderMiddleware from 'redux-pender'
// import accountsReducer from '../ducks/accounts'
// import * as actionCreators from '../ducks/accounts';

export const history = createBrowserHistory()
export const middlewares = [thunk, routerMiddleware(history), penderMiddleware()]

const getMockReducer = jest.fn(
  (initialState) => (state = initialState, action) => {
    switch (action.type) {
      default:
        break
    }
    return state
  }
)

export const getMockStore = (
  initialStateUser,
  initialStateWordlist = {},
  initialStateArticle = {},
  ) => {
  const rootReducer = combineReducers({
    accounts: getMockReducer(initialStateUser),
    wordlist: getMockReducer(initialStateWordlist),
    article: getMockReducer(initialStateArticle),
    router: connectRouter(history),
  })
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const mockStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  )
  return mockStore
}
