import * as React from 'react';
import TimePicker from '../src/TimePicker';

class App extends React.Component {
    onChange = (value: Date | string) => {
        console.log({ value });
    };

    render() {
        return (
            <div>
                <TimePicker
                    name="test"
                    onChange={this.onChange}
                    timeFormat="H:mm"
                    value="15:30"
                    step={30}
                />
            </div>
        );
    }
}

export default App;
