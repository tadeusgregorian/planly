import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import moment from 'moment' // eslint-disable-line no-unused-vars
import 'moment/locale/de'  // this has to be loaded here ! before configure STORE !!!
import configureStore from './reducers/configureStore'
import 'styles/main.css';
import App from 'containers';
//import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
//registerServiceWorker()

if (module.hot) {
  module.hot.accept('containers', () => {
    ReactDOM.render(
      <Provider store={store}><App /></Provider>,
      document.getElementById('root')
    )
  })
}
