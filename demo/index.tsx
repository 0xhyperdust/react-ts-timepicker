// IE 10+ compatibility for demo (must come before other imports)
import 'babel-polyfill';

import * as React from 'react';
import {render} from 'react-dom';

import App from './App';

render(<App />, document.getElementById('root'));
