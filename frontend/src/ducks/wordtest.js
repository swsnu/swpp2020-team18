import { createAction, handleActions } from 'redux-actions'
// import { Map } from 'immutable';
import { pender } from 'redux-pender'
import axios from 'axios'

// actions
const GET_LEVELTEST = 'GET_LEVELTEST'
const GET_WORDTEST = 'GET_WORDTEST'
const SUBMIT_TEST = 'SUBMIT_TEST'
const MAKE_HISTORY = 'MAKE_HISTORY'

const initialState = {
  wordtest: [],
  rightCount: 0,
}

// hadnle actions
export default handleActions(
  {
    ...pender({
      type: GET_LEVELTEST,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return { ...state, wordtest: action.payload.data }
        // state.set('wordlist', [{'word': 'word'}])
      },
    }),
    ...pender({
      type: GET_WORDTEST,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return { ...state, wordtest: action.payload.data }
        // state.set('wordlist', [{'word': 'word'}])
      },
    }),
    ...pender({
      type: SUBMIT_TEST,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return { ...state, rightCount: action.payload.data }
      },
    }),
    ...pender({
      type: MAKE_HISTORY,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return { ...state }
      },
    }),
  },
  initialState
)

// Action Creators
export const getLeveltest = createAction(GET_LEVELTEST, () =>
  axios({
    method: 'get',
    url: '/api/wordtest/level/',
  })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
)

export const getWordtest = createAction(GET_WORDTEST, () =>
  axios({
    method: 'get',
    url: '/api/wordtest/review/',
  })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
)

export const onSubmitTest = createAction(SUBMIT_TEST, (words, answers, type) =>
  axios({
    method: 'patch',
    url: '/api/wordtest/',
    data: {
      words: words,
      answers: answers,
      type: type,
    },
  })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
)

export const makeHistory = createAction(MAKE_HISTORY, (words) =>
  axios({
    method: 'post',
    url: '/api/wordtest/',
    data: {
      words: words,
    },
  })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
)
