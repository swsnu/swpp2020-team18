import { createShallow } from '@material-ui/core/test-utils';
import WordTable from './WordTable'

describe('<WordTable />', () => {
  let shallow;

  beforeEach(() => {  // This is Mocha; in Jest, use beforeAll
    shallow = createShallow();
  });

  it('should work', () => {
    // const wrapper = shallow(<WordTable />);
    // expect(wrapper.length).toBe(1);
  });
});