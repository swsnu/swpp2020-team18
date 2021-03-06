import React from 'react'
// import { shallow, mount } from 'enzyme';
import SignIn from './SignIn'
import { getMockStore } from '../../test-utils/mocks'
import { history } from '../../test-utils/mocks'
// import * as actionCreators from '../../ducks/accounts';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { Route, Switch } from 'react-router-dom'
import { createMount } from '@material-ui/core/test-utils'

const stubInitialState = {
  user: null,
  error_message: 'dddfd',
}

const mockStore = getMockStore(stubInitialState)

describe('<SignIn />', () => {
  let signIn
  let mount

  beforeEach(() => {
    mount = createMount()
    signIn = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path='/' exact render={() => <SignIn />} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    )
  })

  it('should render without errors', () => {
    const component = mount(signIn)
    // console.log(component.debug())
    const wrapper = component.find('SignIn')
    expect(wrapper.length).toBe(1)
  })

  it('should change input values', () => {
    const component = mount(signIn)
    // console.log(component.debug())
    const wrapper = component.find('input#password')
    wrapper.simulate('change', { target: { value: 'Hello' } })
    const wrapper2 = component.find('input#email')
    wrapper2.simulate('change', { target: { value: 'ee@ee.com' } })
    expect(wrapper.length).toBe(1)
  })

  it('should click forgot password', () => {
    const component = mount(signIn)
    // console.log(component.debug())
    const wrapper = component.find('a#forgot-password')
    wrapper.simulate('click')
    expect(wrapper.length).toBe(1)
  })

  it('should render without errors', () => {
    const component = mount(signIn)
    // console.log(component.debug())
    const wrapper = component.find('button')
    wrapper.simulate('click')
    expect(wrapper.length).toBe(1)
  })
})
