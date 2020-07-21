import { shallow } from 'enzyme';
import Registration from './Registration';

describe('Registration test: ', () => {
    const wrapper = shallow(<Registration></Registration>);

    it('should exist: ', () => {
        expect(wrapper).toExist();
    });
})