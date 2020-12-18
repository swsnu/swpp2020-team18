import React from 'react'
// import { shallow, mount } from 'enzyme';
import SignUp from './SignUp'
import { getMockStore } from '../../test-utils/mocks'
import { history } from '../../test-utils/mocks'
// import * as actionCreators from '../../ducks/accounts';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'
import { createMount } from '@material-ui/core/test-utils'

const stubInitialState = {
  user: { username: 'sss' },
}

const mockStore = getMockStore(stubInitialState)

describe('<SignUp />', () => {
  let signUp
  let mount

  beforeEach(() => {
    mount = createMount()
    signUp = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact render={() => <SignUp />} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  })

  it('should render without errors', () => {
    const component = mount(signUp)
    console.log(component.debug())
    // const wrapper = component.find('SignUp')
    // expect(wrapper.length).toBe(1)
  })
})
