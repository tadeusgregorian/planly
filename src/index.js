import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './configs/configureStore'
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
