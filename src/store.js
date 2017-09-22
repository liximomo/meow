import { createStore, applyMiddleware, compose } from 'redux';
import omit from 'lodash-es/omit';
import merge from 'lodash-es/merge';
import promiseMiddleware from 'redux-promise';
import reduxThunk from 'redux-thunk';
import * as storage from './service/storage';
import rootReducer from './reducers';
import debounce from './utils/debounce';

const isProd = process.env.NODE_ENV === 'production';
const actionsBlacklist = [];

const enhancer = compose(
  // Middlewar
  applyMiddleware(reduxThunk, promiseMiddleware),
  window.devToolsExtension && !isProd
    ? window.devToolsExtension({
        actionsBlacklist,
      })
    : noop => noop
);

const state = storage.load();
const initState = rootReducer(undefined, {
  type: '@meow-init',
});
const store = createStore(rootReducer, merge(initState, state), enhancer);


const getPersistentedState = state => omit(state, ['logs', ['projects', 'infoById'], ['projects', 'search']]);

const saveStateToDist = debounce(
  _ => {
    const persistentState = getPersistentedState(store.getState());
    storage.save(persistentState);
  },
  500,
  {
    leading: true,
    trailing: true,
  }
);

const backupStateToLocalStorage = debounce(
  _ => {
    const persistentState = getPersistentedState(store.getState());
    localStorage.setItem('meow_app_data', JSON.stringify(persistentState));
  },
  50,
  {
    leading: true,
    trailing: true,
  }
);

store.subscribe(_ => {
  backupStateToLocalStorage();
  saveStateToDist();
});


if (process.env.NODE_ENV === 'development') {
  window.store = store;
}

export default store;
