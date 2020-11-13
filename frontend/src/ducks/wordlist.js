import { createAction, handleActions } from 'redux-actions'
// import { Map } from 'immutable';
import { pender } from 'redux-pender'
import axios from 'axios'

// actions
const GET_WORDLIST = 'GET_WORDLIST'
const REMOVE_WORD = 'REMOVE_WORD'

const initialState = {
  wordlist: [],
}

// hadnle actions
export default handleActions(
  {
    ...pender({
      type: GET_WORDLIST,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return { ...state, wordlist: action.payload.data }
        // state.set('wordlist', [{'word': 'word'}])
      },
    }),
    ...pender({
      type: REMOVE_WORD,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
      },
    }),
  },
  initialState
)

// Action Creators
export const getWordlist = createAction(GET_WORDLIST, () =>
  axios({
    method: 'get',
    url: '/api/wordlist/',
  })
    .then((response) => {
      console.log(response)
      return response
    })
    .catch((err) => {
      console.log(err)
    })
)

export const removeWord = createAction(REMOVE_WORD, (phrase) =>
  axios({
    method: 'patch',
    url: '/api/wordlist/',
    data: {
      phrase: phrase,
      action: 'remove',
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
