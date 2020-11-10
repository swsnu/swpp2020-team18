import { createAction, handleActions } from 'redux-actions'
import { pender } from 'redux-pender'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// Actions
const SIGNIN = 'accounts/SIGNIN'
const SIGNUP = 'accounts/SIGNUP'
const SIGNOUT = 'accounts/SIGNOUT'
const CHECKLOGIN = 'accounts/CHECKLOGIN'

// Action Creators
export const signIn = createAction(
  // payload = {email: _, password: _}
  SIGNIN,
  (payload) => {
    return axios
      .post('/api/accounts/signin', payload)
      .then((res) => res)
      .catch((err) => err)
  }
)
export const signUp = createAction(
  // payload = {email: _, username: _, password: _}
  SIGNUP,
  (payload) => {
    return axios
      .post('/api/accounts/signup', payload)
      .then((res) => res)
      .catch((err) => err)
  }
)
export const signOut = createAction(
  // payload = null
  SIGNOUT,
  () => {
    return axios
      .get('/api/accounts/signout')
      .then((res) => res)
      .catch((err) => err)
  }
)
export const checkLogin = createAction(
  // payload = null
  CHECKLOGIN,
  () => {
    return axios
      .get('/api/accounts/signin')
      .then((res) => res)
      .catch((err) => err)
  }
)

// Initial State
const initialState = {
  user: null,
}

// Reducers
export default handleActions(
  {
    ...pender({
      type: SIGNIN,
      onSuccess: (state, action) => {
        console.log(action.payload.status)
        console.log(action.payload.data)
        return { ...state, user: action.payload.data }
      },
    }),
    ...pender({
      type: SIGNUP,
      onSuccess: (state, action) => {
        return { ...state, user: action.payload.data }
      },
    }),
    ...pender({
      type: SIGNOUT,
      onSuccess: (state) => {
        return { ...state, user: null }
      },
    }),
    ...pender({
      type: CHECKLOGIN,
      onSuccess: (state, action) => {
        console.log(action.payload.status)
        console.log(action.payload.data)
        return { ...state, user: action.payload.data }
      },
    }),
  },
  initialState
)
