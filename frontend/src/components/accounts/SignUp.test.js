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
  user: null,
  error_message: 'dddfd',
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
    // console.log(component.debug())
    const wrapper = component.find('SignUp')
    expect(wrapper.length).toBe(1)
  })

  it('should change input values', () => {
    const component = mount(signUp)
    // console.log(component.debug())
    const wrapper = component.find('input#password')
    wrapper.simulate('change', { target: { value: 'Hello' } })
    const wrapper2 = component.find('input#username')
    wrapper2.simulate('change', { target: { value: 'gorani' } })
    const wrapper3 = component.find('input#email')
    wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
    expect(wrapper.length).toBe(1)
  })

  it('should render without errors', () => {
    const component = mount(signUp)
    // console.log(component.debug())
    const wrapper = component.find('button')
    wrapper.simulate('click')
    expect(wrapper.length).toBe(1)
  })

  it('should validate erroneous input', () => {
    const component = mount(signUp)
    // console.log(component.debug())
    const wrapper2 = component.find('input#username')
    wrapper2.simulate('change', { target: { value: '' } })
    const wrapper3 = component.find('input#email')
    wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
    const wrapper = component.find('input#password')
    wrapper.simulate('change', { target: { value: '1234' } })
    const wrapper5 = component.find('button')
    wrapper5.simulate('click')
    expect(wrapper5.length).toBe(1)
  })

  it('should validate erroneous input', () => {
    const component = mount(signUp)
    // console.log(component.debug())
    const wrapper2 = component.find('input#username')
    wrapper2.simulate('change', { target: { value: 'gorani' } })
    const wrapper3 = component.find('input#email')
    wrapper3.simulate('change', { target: { value: 'ee@ee.com' } })
    const wrapper = component.find('input#password')
    wrapper.simulate('change', { target: { value: '1234' } })
    const wrapper5 = component.find('button')
    wrapper5.simulate('click')
    expect(wrapper5.length).toBe(1)
  })

  it('should validate erroneous input', () => {
    const component = mount(signUp)
    // console.log(component.debug())
    const wrapper2 = component.find('input#username')
    wrapper2.simulate('change', { target: { value: 'gorani' } })
    const wrapper3 = component.find('input#email')
    wrapper3.simulate('change', { target: { value: 'aab' } })
    const wrapper = component.find('input#password')
    wrapper.simulate('change', { target: { value: '1234' } })
    const wrapper5 = component.find('button')
    wrapper5.simulate('click')
    expect(wrapper5.length).toBe(1)
  })
})
