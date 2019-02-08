# React TS Timepicker

This is a lightweight and easy to use time picker without depencies for React, written in Typescript and thoroughly covered by unit tests.

## Installation

Install plugin with npm:
```
$ npm install react-ts-timepicker
```
Or yarn:
```
$ yarn add react-ts-timepicker
```

## Compatibility

React 16+ (iternally it uses createPortal to append suggestion to the body element). Version for React 15 will be added later.

## Basic usage

```javascript
import React, { Component } from 'react';
import TimePicker from 'react-ts-timepicker';

class App extends Component {
  state = {
    value: '10:00',
  }
 
  onChange = value => {
    this.setState({ value })
  }
 
  render() {
    return (
      <div>
        <TimePicker
          onChange={this.onChange}
          value={this.state.value}
        />
      </div>
    );
  }
}
``` 

## Configuration
Property | Type | Default value |Description
------------ | ------------- | ------------- | -------------
value | string / Date / null | `null` | The value of the input.
timeFormat | string | `hh:mma` | Similar to moment.js time format string. See below for more information.
name | string | `timepicker` | The name of the input.
onChange | function | `() => {}` | Function called when the user picks a valid time. Type of the value will be the same as `value` has.
step | number | `30` | Step in minutes between two suggestions.
minTime | string / null | `null` | Suggestions start time.
maxTime | string / null | `null` | Suggestions end time. Without this prop suggestions max time equals one day.
includeMax | boolean | `true` | Whether or not include suggestions max time.
hideOnScroll | boolean | `false` | Whether or not hide suggestions on window scroll.
allowOnlySuggestions | boolean | `false` | Allow on suggestions values to be entered to the input. Input value will be rounded to the nearest suggestion.
className | string | `''` | Class name of the wrapping div. Can be used for overriding default time picker styles.

## Time formats
Input | Example | Description
------------ | ------------- | -------------
`H HH` | `0..23` | Hours (24 hour time)
`h hh` | `1..12` | Hours (12 hour time used with a A.)
`a A`	| `am pm`	 | Post or ante meridiem (Note the one character a p are also considered valid)
`m mm` | `0..59` | Minutes
`s ss` | `0..59` | Seconds

## Lisence
The MIT License.
