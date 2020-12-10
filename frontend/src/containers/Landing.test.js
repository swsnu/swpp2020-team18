import React from "react";
import { createMount } from '@material-ui/core/test-utils';
import Landing from './Landing'
import { getMockStore } from '../test-utils/mocks';
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from '@material-ui/styles'
import { createBrowserHistory } from 'history';
import { makeStyles } from '@material-ui/core/styles'
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

Enzyme.configure({ adapter: new Adapter() });

const history = createBrowserHistory();

const stubInitialState = {
  user: null
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#414141',
      contrastText: '#fff',
    },
    secondary: {
      main: '#a31545',
      contrastText: '#fff',
    },
  },
})

const mockStore = getMockStore(stubInitialState);

const useStyles = makeStyles(() => ({}));

describe('<Landing />', () => {

  let landing;
  beforeEach(() => {
    landing = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route path='/' exact component={Landing} />
            </Switch>
          </ThemeProvider>
        </ConnectedRouter>
      </Provider>
    );
  });

  it('should work', () => {
    const component = createMount()(landing);
    const wrapper = component.find('Landing');
    expect(wrapper.length).toBe(1);

  });
});