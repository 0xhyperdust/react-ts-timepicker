import 'jsdom-global/register';
import * as React from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';

import TimePicker from '../src/TimePicker';

const INPUT_CLASS = '.time-picker__input';
const SUGGESTIONS_CLASS = '.time-picker__suggestion-list';
const SUGGESTION_CLASS = '.time-picker__suggestion';
const SUGGESTION_SELECTED_CLASS = '.time-picker__suggestion_selected';

interface EventObject {
    [key: string]: any;
}

describe('<TimePicker />', () => {
    let events = {} as EventObject;

    beforeEach(() => {
        document.addEventListener = jest.fn((event, cb) => {
            events[event] = cb;
        });
    });

    afterEach(() => {
        document.addEventListener = null;
    });

    test('converts time to seconds', () => {
        const wrapper = shallow(<TimePicker value={null} name="test" />);
        const instance = wrapper.instance() as TimePicker;

        expect(instance.convertTimeToSeconds(null)).toBeNull();
        expect(instance.convertTimeToSeconds('')).toBeNull();
        expect(instance.convertTimeToSeconds('dummy')).toBeNull();
        expect(instance.convertTimeToSeconds('12am')).toEqual(0);
        expect(instance.convertTimeToSeconds('12a')).toEqual(0);
        expect(instance.convertTimeToSeconds('12:00am')).toEqual(0);
        expect(instance.convertTimeToSeconds('12pm')).toEqual(43200);
        expect(instance.convertTimeToSeconds('1pm')).toEqual(46800);
        expect(instance.convertTimeToSeconds('12p')).toEqual(43200);
        expect(instance.convertTimeToSeconds('1230am')).toEqual(1800);
        expect(instance.convertTimeToSeconds('1230pm')).toEqual(45000);
        expect(instance.convertTimeToSeconds('12:00')).toEqual(43200);
        expect(instance.convertTimeToSeconds('12:30')).toEqual(45000);
        expect(instance.convertTimeToSeconds('0000')).toEqual(0);
        expect(instance.convertTimeToSeconds('23:30')).toEqual(84600);
        expect(instance.convertTimeToSeconds('12:30:35am')).toEqual(1835);
        expect(instance.convertTimeToSeconds('12:30:35')).toEqual(45035);
        expect(instance.convertTimeToSeconds('13am')).toEqual(46800);
        expect(instance.convertTimeToSeconds('25:00:00')).toEqual(3600);
        expect(instance.convertTimeToSeconds(new Date(2018, 11, 24, 10, 33, 30, 0))).toEqual(38010);

        const wrapperNoNormalize = shallow(<TimePicker value={null} name="test" normalizeTime={false} />);
        const instanceNoNormalize = wrapperNoNormalize.instance() as TimePicker;
        expect(instanceNoNormalize.convertTimeToSeconds('25:00:00')).toBeNull();
    });

    test('converts seconds to formatted string time', () => {
        // default time format - hh:mma
        {
            const wrapper = shallow(<TimePicker value={null} name="test" />);
            const instance = wrapper.instance() as TimePicker;

            expect(instance.convertSecondsToFormattedString(0)).toEqual('12:00am');
            expect(instance.convertSecondsToFormattedString(3600)).toEqual('1:00am');
            expect(instance.convertSecondsToFormattedString(1800)).toEqual('12:30am');
            expect(instance.convertSecondsToFormattedString(43200)).toEqual('12:00pm');
            expect(instance.convertSecondsToFormattedString(45000)).toEqual('12:30pm');
            expect(instance.convertSecondsToFormattedString(84600)).toEqual('11:30pm');
            expect(instance.convertSecondsToFormattedString(30)).toEqual('12:00am');
        }

        // 24 hour - HH:mm
        {
            const wrapper = shallow(<TimePicker value={null} name="test" timeFormat="HH:mm" />);
            const instance = wrapper.instance() as TimePicker;

            expect(instance.convertSecondsToFormattedString(0)).toEqual('0:00');
            expect(instance.convertSecondsToFormattedString(3600)).toEqual('1:00');
            expect(instance.convertSecondsToFormattedString(1800)).toEqual('0:30');
            expect(instance.convertSecondsToFormattedString(43200)).toEqual('12:00');
            expect(instance.convertSecondsToFormattedString(45000)).toEqual('12:30');
            expect(instance.convertSecondsToFormattedString(46800)).toEqual('13:00');
            expect(instance.convertSecondsToFormattedString(84600)).toEqual('23:30');
            expect(instance.convertSecondsToFormattedString(30)).toEqual('0:00');
        }

        // 24 hour with seconds- HH:mm:ss
        {
            const wrapper = shallow(<TimePicker value={null} name="test" timeFormat="HH:mm:ss" />);
            const instance = wrapper.instance() as TimePicker;

            expect(instance.convertSecondsToFormattedString(0)).toEqual('0:00:00');
            expect(instance.convertSecondsToFormattedString(3600)).toEqual('1:00:00');
            expect(instance.convertSecondsToFormattedString(1830)).toEqual('0:30:30');
            expect(instance.convertSecondsToFormattedString(43200)).toEqual('12:00:00');
            expect(instance.convertSecondsToFormattedString(45000)).toEqual('12:30:00');
            expect(instance.convertSecondsToFormattedString(46800)).toEqual('13:00:00');
            expect(instance.convertSecondsToFormattedString(84600)).toEqual('23:30:00');
            expect(instance.convertSecondsToFormattedString(30)).toEqual('0:00:30');
        }

        // 24 hour with seconds- H:m:s
        {
            const wrapper = shallow(<TimePicker value={null} name="test" timeFormat="H:m:s" />);
            const instance = wrapper.instance() as TimePicker;

            expect(instance.convertSecondsToFormattedString(0)).toEqual('0:00:00');
            expect(instance.convertSecondsToFormattedString(3600)).toEqual('1:00:00');
            expect(instance.convertSecondsToFormattedString(1830)).toEqual('0:30:30');
            expect(instance.convertSecondsToFormattedString(43200)).toEqual('12:00:00');
            expect(instance.convertSecondsToFormattedString(45000)).toEqual('12:30:00');
            expect(instance.convertSecondsToFormattedString(46800)).toEqual('13:00:00');
            expect(instance.convertSecondsToFormattedString(84600)).toEqual('23:30:00');
            expect(instance.convertSecondsToFormattedString(30)).toEqual('0:00:30');
        }

        // other divider - h/ma
        {
            const wrapper = shallow(<TimePicker value={null} name="test" timeFormat="h/ma" />);
            const instance = wrapper.instance() as TimePicker;

            expect(instance.convertSecondsToFormattedString(0)).toEqual('12/00am');
            expect(instance.convertSecondsToFormattedString(3600)).toEqual('1/00am');
            expect(instance.convertSecondsToFormattedString(1800)).toEqual('12/30am');
            expect(instance.convertSecondsToFormattedString(43200)).toEqual('12/00pm');
            expect(instance.convertSecondsToFormattedString(45000)).toEqual('12/30pm');
            expect(instance.convertSecondsToFormattedString(84600)).toEqual('11/30pm');
            expect(instance.convertSecondsToFormattedString(30)).toEqual('12/00am');
        }
    });

    test('sets input value based on value prop', () => {
        const wrapper = shallow(<TimePicker value="5am" name="test" />);
        const input = wrapper.find(INPUT_CLASS);
        expect(input.props().value).toEqual('5:00am');
    });

    test('renders and shows suggestion on input focus', () => {
        const wrapper = mount(<TimePicker value={null} name="test" />);
        wrapper.find(INPUT_CLASS).simulate('focus');
        expect(document.body.querySelector(SUGGESTIONS_CLASS)).not.toBeNull();
        wrapper.unmount();
    });

    test('generate suggestions in the suggestion wrapper', () => {
        const wrapper = mount(<TimePicker value={null} name="test" />);
        wrapper.find(INPUT_CLASS).simulate('focus');
        const stateSuggestions = wrapper.state('suggestions') as Array<number>;
        expect(document.body.querySelectorAll(SUGGESTION_CLASS).length)
            .toEqual(stateSuggestions.length);
        wrapper.unmount();
    });

    test('hides suggestions on outside click', () => {
        const wrapper = mount(<TimePicker value={null} name="test" />);

        wrapper.find(INPUT_CLASS).simulate('focus');

        events.click({ target: document.body });

        expect(wrapper.state('showSuggestions')).toEqual(false);
        wrapper.unmount();
    });

    test('scrolls suggestion list if value is set and suggestions are open', () => {
        const wrapper = mount(
            <TimePicker
                value="1:00am"
                name="test"
            />
        );
        const instance = wrapper.instance() as TimePicker;
        wrapper.find(INPUT_CLASS).simulate('focus');
        const { suggestionEl, suggestionsWrapperEl } = instance;

        // suggestions are scrolled to show previous suggestion as well
        expect(suggestionsWrapperEl.scrollTop).toEqual(suggestionEl.offsetHeight * 2);

        wrapper.unmount();
    });

    test('scrolls suggestion list on input change', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        wrapper.find(INPUT_CLASS)
            .simulate('focus')
            .simulate('change', { target: { value: '1:00am' } });

        const instance = wrapper.instance() as TimePicker;
        const { suggestionEl, suggestionsWrapperEl } = instance;

        expect(suggestionsWrapperEl.scrollTop).toEqual(suggestionEl.offsetHeight * 2);

        wrapper.unmount();
    });

    test('calls onChange on input change with parsed or non-parsed value', () => {
        const onChangeSpy = jest.fn();

        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
                onChange={onChangeSpy}
            />
        );

        const input = wrapper.find(INPUT_CLASS);

        // if input is not parsed it should return non-parsed value
        input.simulate('change', { target: { value: '775' } });
        expect(onChangeSpy.mock.calls[0][0]).toEqual('775');

        input.simulate('change', { target: { value: '1' } });
        expect(onChangeSpy.mock.calls[1][0]).toEqual('1:00am');

        input.simulate('change', { target: { value: '' } });
        expect(onChangeSpy.mock.calls[2][0]).toEqual('');

        wrapper.unmount();
    });

    test('sets value on suggestion select', () => {
        const onChangeSpy = jest.fn();

        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
                onChange={onChangeSpy}
            />
        );

        wrapper.find(INPUT_CLASS).simulate('focus');
        wrapper.find(SUGGESTION_CLASS).at(1).simulate('click');
        expect(onChangeSpy.mock.calls[0][0]).toEqual('12:30am');

        wrapper.unmount();
    });

    test('returns Date if Date was initially passed as value', () => {
        const onChangeSpy = jest.fn();

        const initialDate = new Date(1988, 1, 21, 4, 50);
        const expectedDate = new Date(1988, 1, 21, 14, 0);

        const wrapper = mount(
            <TimePicker
                value={initialDate}
                name="test"
                onChange={onChangeSpy}
            />
        );

        wrapper.find(INPUT_CLASS).simulate('change', { target: { value: '2:00pm' } });
        const result = onChangeSpy.mock.calls[0][0];
        expect(result.getTime()).toEqual(expectedDate.getTime());

        wrapper.unmount();
    });

    test('hides suggestion on scroll if corresponding option is set', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
                hideOnScroll={true}
            />
        );

        wrapper.find(INPUT_CLASS).simulate('focus');

        const ev = document.createEvent("UIEvents");
        ev.initUIEvent("scroll", true, true, window, 1);
        window.dispatchEvent(ev);

        expect(wrapper.state('showSuggestions')).toEqual(false);

        wrapper.unmount();
    });

    test('rounds time to the nearest suggestion if allowOnlySuggestions prop is set', () => {
        const onChangeSpy = jest.fn();

        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
                allowOnlySuggestions={true}
                onChange={onChangeSpy}
            />
        );

        const input = wrapper.find(INPUT_CLASS);

        input.simulate('change', { target: { value: '1:35am' } });
        expect(onChangeSpy.mock.calls[0][0]).toEqual('1:30am');

        input.simulate('change', { target: { value: '1:55am' } });
        expect(onChangeSpy.mock.calls[1][0]).toEqual('2:00am');

        wrapper.unmount();
    });

    test('parses input value on blur', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        wrapper.find(INPUT_CLASS).simulate('change', { target: { value: '1am' } });
        wrapper.find(INPUT_CLASS).simulate('blur');
        expect(wrapper.state('inputValue')).toEqual('1:00am');

        wrapper.unmount();
    });

    test('changes highlighted suggestion on keydown arrow up and down', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        events.keydown({ key: 'ArrowDown' });
        events.keydown({ key: 'ArrowDown' });

        expect(document.querySelectorAll(SUGGESTION_SELECTED_CLASS).length).toEqual(1);
        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(1);

        events.keydown({ key: 'ArrowUp' });

        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(0);

        wrapper.unmount();
    });


    test('does not allow to highlight suggestion beyond suggestion list on arrow up/down', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        const suggestions: Array<number> = wrapper.state('suggestions');

        for (let i = 0; i < suggestions.length + 5; i++) {
            events.keydown({ key: 'ArrowDown' })
        }

        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(suggestions.length - 1);

        for (let i = 0; i < suggestions.length + 5; i++) {
            events.keydown({ key: 'ArrowUp' })
        }

        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(0);

        wrapper.unmount();
    });

    test('highlights suggestion on arrow up/down based on value', () => {
        const wrapper = mount(
            <TimePicker
                value="0:30"
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        events.keydown({ key: 'ArrowDown' });

        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(2);
    });

    test('selects suggestion on enter', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        events.keydown({ key: 'ArrowDown' });
        events.keydown({ key: 'ArrowDown' });

        const highlightedSuggestionIndex: number = wrapper.state('highlightedSuggestionIndex');
        const suggestions: Array<number> = wrapper.state('suggestions');
        const highlightedSuggestionValue = suggestions[highlightedSuggestionIndex];

        events.keydown({ key: 'Enter' });

        expect(wrapper.state('value')).toEqual(highlightedSuggestionValue);

        wrapper.unmount();
    });

    test('parses input value on enter', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('change', { target: { value: '442' } });
        events.keydown({ key: 'Enter' });
        expect(wrapper.state('inputValue')).toEqual('4:42am');
    });

    test('shows suggestions on click if input is focused but suggestion are hidden', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');
        events.keydown({ key: 'Enter' });

        wrapper.find(INPUT_CLASS).simulate('click');

        expect(wrapper.state('showSuggestions')).toEqual(true);

        wrapper.unmount();
    });

    test('shows suggestions on arrow down if input is focused but suggestions are hidden', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        events.keydown({ key: 'ArrowDown' });
        events.keydown({ key: 'ArrowDown' });
        events.keydown({ key: 'Enter' });

        expect(wrapper.state('showSuggestions')).toEqual(false);

        events.keydown({ key: 'ArrowDown' });

        expect(wrapper.state('showSuggestions')).toEqual(true);

        wrapper.unmount();
    });

    test('closes suggestions on escape keydown', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        const instance = wrapper.instance() as TimePicker;
        instance.inputEl.focus();
        wrapper.find(INPUT_CLASS).simulate('focus');

        expect(wrapper.state('showSuggestions')).toEqual(true);

        events.keydown({ key: 'Escape' });

        expect(wrapper.state('showSuggestions')).toEqual(false);

        wrapper.unmount();
    });

    test('ignores keydown events if input is not focused', () => {
        const wrapper = mount(
            <TimePicker
                value={null}
                name="test"
            />
        );

        events.keydown({ key: 'ArrowDown' });

        expect(wrapper.state('showSuggestions')).toEqual(false);
        expect(wrapper.state('highlightedSuggestionIndex')).toEqual(null);

        wrapper.unmount();
    });
});
