import { createAction, handleActions } from 'redux-actions'
import { pender } from 'redux-pender'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

// Actions
const GETARTICLE = 'article/GETARTICLE'
const GETARTICLETEST = 'article/GETARTICLETEST'
const SUBMITARTICLETEST = 'article/SUBMITARTICLETEST'

// Action Creators
export const getArticle = createAction(
  // payload = id
  GETARTICLE,
  (payload) => {
    return axios
      .get(`/api/articles/${payload}`)
      .then((res) => res)
      .catch((err) => err)
  }
)
export const getArticleTest = createAction(
  // payload = id
  GETARTICLETEST,
  (payload) => {
    return axios
      .get(`/api/articles/${payload}/quiz`)
      .then((res) => res)
      .catch((err) => err)
  }
)
export const submitArticleTest = createAction(
  // payload = { id: _, answers: [...] }
  SUBMITARTICLETEST,
  (payload) => {
    return axios
      .post(`/api/articles/${payload['id']}/quiz`, {
        answers: payload['answers'],
      })
      .then((res) => res)
      .catch((err) => err)
  }
)

// Initial State
const initialState = {
  article: null,
}

// Reducers
export default handleActions(
  {
    ...pender({
      type: GETARTICLE,
      onSuccess: (state, action) => {
        console.log(state)
        console.log({
          ...state,
          article: {
            ...state.article,
            content: action.payload.data.content,
            title: action.payload.data.title,
            author: action.payload.data.author,
          },
        })
        return {
          ...state,
          article: {
            ...state.article,
            content: action.payload.data.content,
            title: action.payload.data.title,
            author: action.payload.data.author,
            phrases: action.payload.data.phrases,
          },
        }
      },
    }),
    ...pender({
      type: GETARTICLETEST,
      onSuccess: (state, action) => {
        console.log(state)
        console.log({
          ...state,
          article: {
            ...state.article,
            phrases: action.payload.data.phrases,
          },
        })
        return {
          ...state,
          article: {
            ...state.article,
            phrases: action.payload.data.phrases,
          },
        }
      },
    }),
    ...pender({
      type: SUBMITARTICLETEST,
      onSuccess: (state, action) => {
        console.log(action.payload.data)
        return {
          ...state,
          result: action.payload.data,
        }
      },
    }),
  },

  initialState
)
