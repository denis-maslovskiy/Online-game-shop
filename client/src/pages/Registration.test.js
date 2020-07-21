import React from 'react';
import { shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom'
import Registration from './Registration';

describe('Registration test: ', () => {
    const wrapper = shallow(<MemoryRouter><Registration/></MemoryRouter>);

    it('should exist: ', () => {
        expect(wrapper).toExist();
    });

    it('to be defined: ', () => {
        expect(wrapper).toBeDefined();
    });

    // wrapper.find('.box__submit-btn').simulate('click');
    console.log('Log: ', wrapper.find('.box__submit-btn'))
    // console.log(wrapper.find('.box__submit-btn').text())


})