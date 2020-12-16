import { createAction, handleActions } from 'redux-actions'
// import { Map } from 'immutable';
import { pender } from 'redux-pender'
import axios from 'axios'

// actions
const GET_WORDTEST = 'GET_WORDTEST'
const SUBMIT_TEST = 'SUBMIT_TEST'

const initialState = {
  wordtest: [],
  rightCount: 0,
}

// hadnle actions
export default handleActions(
  {
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
  },
  initialState
)

// Action Creators
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