import { createAction, handleActions } from 'redux-actions'
// import { Map } from 'immutable';
import { pender } from 'redux-pender'
import axios from 'axios'

// actions
const GET_WORDTEST = 'GET_WORDTEST'

const initialState = {
  wordtest: [],
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
