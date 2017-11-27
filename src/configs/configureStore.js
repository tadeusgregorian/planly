import {createStore, applyMiddleware} from "redux"
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from "redux-thunk"
import rootReducer from '../reducers'

export default function configureStore() {
  const middlewares = process.env.NODE_ENV !== 'production'
    ? [require('redux-immutable-state-invariant').default(), thunk]
    : [thunk];

  const middlewareEnhancer = applyMiddleware(...middlewares);
  const storeEnhancers = [middlewareEnhancer];
  const composedEnhancer = composeWithDevTools(...storeEnhancers);

  const store = createStore(
    rootReducer,
    {},
    composedEnhancer
  );

  if(process.env.NODE_ENV !== "production") {
    if(module.hot) {
      module.hot.accept("reducers", () =>{
        store.replaceReducer(rootReducer)
      })
    }
  }

  return store
}
