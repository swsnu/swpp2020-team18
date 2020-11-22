// import React from 'react';
// import { shallow, mount } from 'enzyme';
// import ArticleSideTest from './ArticleSideTest';
// // import { getMockStore } from '../../test-utils/mocks';
// // import { history } from '../../test-utils/mocks';
// // import * as actionCreators from '../../ducks/accounts';
// import { Route, Redirect, Switch } from 'react-router-dom';
// // import { createMount } from '@material-ui/core/test-utils';
// import { ThemeProvider } from '@material-ui/core/styles';
// import { Provider } from 'react-redux';
// import { ConnectedRouter } from 'connected-react-router';

// describe('<ArticleSideTest />', () => {
//   let articleSideTest;
//   // let mount;
//   let wrapArticleSideTest;

//   beforeEach(() => {
//     // articleSideTest = ()
//     wrapArticleSideTest = (
//       <Provider>
//         <ArticleSideTest
//               answer = "안녕"
//               onAnswerChoice = {()=>(1)}
//               selectedPhrase = {{"keyword":"hi", "choices":["가짜", "가짜2", "가짜3", "안녕"]}}
//             />
//       </Provider>
//     );
//   })

//   it('should render without errors', () => {
//     const component = mount(wrapArticleSideTest);
//     console.log(component.debug())
//     const wrapper = component.find(ArticleSideTest);
//     expect(wrapper.length).toBe(1);
//   });
// })
