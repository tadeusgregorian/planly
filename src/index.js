import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import moment from 'moment' // eslint-disable-line no-unused-vars
import 'moment/locale/de'  // this has to be loaded here ! before configure STORE !!!
import 'moment-feiertage'  // this one after moment
import configureStore from './configs/configureStore'
import 'styles/main.css';
import App from 'containers';
import { isProduction, isBuild } from 'configs/index'
//import registerServiceWorker from './registerServiceWorker';

const store = configureStore()

console.log('isProduction: ', isProduction());
console.log('isBuild: ', isBuild());

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
)
//registerServiceWorker()
//masterNow

if (module.hot) {
  module.hot.accept('containers', () => {
    ReactDOM.render(
      <Provider store={store}><App /></Provider>,
      document.getElementById('root')
    )
  })
}
