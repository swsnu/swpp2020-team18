import React from 'react'
// import { mount } from 'enzyme';
import { Provider } from 'react-redux'
import { createMount } from '@material-ui/core/test-utils'
import App from './App'
import { getMockStore, history } from './test-utils/mocks'

const mockStore = getMockStore({})

describe('App', () => {
  let app
  let mount

  beforeEach(() => {
    mount = createMount()
    app = (
      <Provider store={mockStore}>
        <App history={history} />
      </Provider>
    )
  })

  it('should render', () => {
    const component = mount(app)
    expect(component.find('App').length).toBe(1)
  })
})
