import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';

import './menu';
import store from './store';
import App from './App';

import './style/global.scss';
import './style.scss';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
