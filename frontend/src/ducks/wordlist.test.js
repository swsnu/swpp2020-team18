import axios from 'axios';
import * as actions from './wordlist';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import penderMiddleware from 'redux-pender'

const history = createBrowserHistory();

const rootReducer = combineReducers({
    // TODO
    wordlist: actions.handleActions,
    router: connectRouter(history)
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer,
    composeEnhancers(
        applyMiddleware(thunk, routerMiddleware(history), penderMiddleware())));

const stubWordlist = {
    word: "example",
    phrase: "example sentence",
    korean_meaning: "예시",
    confidence: 1,
    created_at: null
};

describe('wordlist actions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    // it(`'getWordlist' should fetch wordlist data correctly`, (done) => {
        // const stubWordlistList = [stubWordlist];
        // const spy = jest.spyOn(axios, 'get')
        //     .mockImplementation(url => {
        //         return new Promise((resolve, reject) => {
        //             const result = {
        //                 status: 200,
        //                 data: stubWordlistList
        //             };
        //             resolve(result);
        //         });
        //     })

        // store.dispatch(actions.getWordlist()).then(() => {
        //     const newState = store.getState();
        //     expect(newState.wordlist.wordlist).toBe(stubWordlistList);
        //     expect(spy).toHaveBeenCalledTimes(1);
        //     done();
        // });
    // });

    // it(`'login' should login correctly`, (done) => {

    //     const spy = jest.spyOn(axios, 'put')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: stubLogin
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.login(stubLogin)).then(() => {
    //         const newState = store.getState();
    //         expect(newState.login.authorized).toBe(true);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // // it(`'login' should not login when invlaid data is given`, (done) => {

    // //     const spy = jest.spyOn(axios, 'put')
    // //         .mockImplementation(url => {
    // //             return new Promise((resolve, reject) => {
    // //                 const result = {
    // //                     status: 200,
    // //                     data: stubLogin
    // //                 };
    // //                 resolve(result);
    // //             });
    // //         })

    // //     store.dispatch(actionCreators.login(stubInvalidLogin)).then(() => {
    // //         const newState = store.getState();
    // //         expect(newState.login.authorized).toBe(false);
    // //         expect(spy).toHaveBeenCalledTimes(0);
    // //         done();
    // //     });
    // // });

    // it(`'logout' should fetch logout data correctly`, (done) => {

    //     const spy = jest.spyOn(axios, 'put')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: stubLogout
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.logout()).then(() => {
    //         const newState = store.getState();
    //         expect(newState.login.authorized).toBe(false);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'getUsers' should fetch users correctly`, (done) => {
    //     const stubUserList = [stubLogin];

    //     const spy = jest.spyOn(axios, 'get')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 304,
    //                     data: stubUserList
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.getUsers(stubUserList)).then(() => {
    //         const newState = store.getState();
    //         expect(newState.article.users).toBe(stubUserList);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'getArticles' should fetch articles correctly`, (done) => {
    //     const stubArticleList = [stubArticle];

    //     const spy = jest.spyOn(axios, 'get')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 304,
    //                     data: stubArticleList
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.getArticles(stubArticleList)).then(() => {
    //         const newState = store.getState();
    //         expect(newState.article.articles).toBe(stubArticleList);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'postArticle' should post article correctly`, (done) => {

    //     const spy = jest.spyOn(axios, 'post')
    //         .mockImplementation((url, td) => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 201,
    //                     data: stubArticle
    //                 };
    //                 resolve(result);
    //             });
    //         })
    //     store.dispatch(actionCreators.postArticle(stubArticle)).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'deleteArticle' should delete article correctly`, (done) => {
    //     const spy = jest.spyOn(axios, 'delete')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: null,
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.deleteArticle()).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'editArticle' should edit article correctly`, (done) => {
    //     const spy = jest.spyOn(axios, 'put')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: stubArticle,
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.editArticle(stubArticle)).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // // comment

    // it(`'getComments' should fetch comments correctly`, (done) => {
    //     const stubCommentList = [stubComment];

    //     const spy = jest.spyOn(axios, 'get')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 304,
    //                     data: stubCommentList
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.getComments(stubComment.article_id)).then(() => {
    //         const newState = store.getState();
    //         expect(newState.comment.comments).toEqual(stubCommentList);
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'postComment' should post comment correctly`, (done) => {

    //     const spy = jest.spyOn(axios, 'post')
    //         .mockImplementation((url, td) => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 201,
    //                     data: stubComment
    //                 };
    //                 resolve(result);
    //             });
    //         })
    //     store.dispatch(actionCreators.postComment(stubComment)).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'deleteComment' should delete comment correctly`, (done) => {
    //     const spy = jest.spyOn(axios, 'delete')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: null,
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.deleteComment()).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });

    // it(`'editComment' should edit comment correctly`, (done) => {
    //     const spy = jest.spyOn(axios, 'put')
    //         .mockImplementation(url => {
    //             return new Promise((resolve, reject) => {
    //                 const result = {
    //                     status: 200,
    //                     data: stubComment,
    //                 };
    //                 resolve(result);
    //             });
    //         })

    //     store.dispatch(actionCreators.editComment(stubComment)).then(() => {
    //         expect(spy).toHaveBeenCalledTimes(1);
    //         done();
    //     });
    // });






    // // it(`'getTodo' should fetch todo correctly`, (done) => {
    // //     const spy = jest.spyOn(axios, 'get')
    // //         .mockImplementation(url => {
    // //             return new Promise((resolve, reject) => {
    // //                 const result = {
    // //                     status: 200,
    // //                     data: stubTodo
    // //                 };
    // //                 resolve(result);
    // //             });
    // //         })

    // //     store.dispatch(actionCreators.getTodo()).then(() => {
    // //         const newState = store.getState();
    // //         expect(newState.td.selectedTodo).toBe(stubTodo);
    // //         expect(spy).toHaveBeenCalledTimes(1);
    // //         done();
    // //     });
    // // });







    // // it(`'toggleTodo' should toggle todo correctly`, (done) => {
    // //     const spy = jest.spyOn(axios, 'put')
    // //         .mockImplementation(url => {
    // //             return new Promise((resolve, reject) => {
    // //                 const result = {
    // //                     status: 200,
    // //                     data: null,
    // //                 };
    // //                 resolve(result);
    // //             });
    // //         })

    // //     store.dispatch(actionCreators.toggleTodo()).then(() => {
    // //         expect(spy).toHaveBeenCalledTimes(1);
    // //         done();
    // //     });
    // // });
});
