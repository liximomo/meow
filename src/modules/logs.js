// import { createSelector, createStructuredSelector } from 'reselect';
// import dotProp from 'dot-prop-immutable';

import uuid from 'uuid/v1';
import store from '../store';
import createReducer from '../utils/createReducer';
import createAction from '../utils/createAction';
import createKeysSelector from '../utils/createKeysSelector';

const ADD_LOG = 'ADD_LOG';

const initState = {
  data: [],
};

const MAX_LOG_NUM = 500;
const REDUCE_FACTOR = 0.5;

const reducer = createReducer(initState, {
  [ADD_LOG](state, action) {
    let data = state.data.concat(action.payload);
    if (data.length > MAX_LOG_NUM) {
      data = data.slice(Math.floor(MAX_LOG_NUM * (1 - REDUCE_FACTOR)));
    }
    return {
      ...state,
      data,
    };
  },
});

const keySels = createKeysSelector(initState, 'logs');
const addLog = createAction(ADD_LOG, (log, level = 'info') => ({
  id: uuid(),
  level: level,
  msg: log,
}));

const createLog = level => (...args) => {
  store.dispatch(
    addLog(
      args.map(item => (typeof item === 'object' ? JSON.stringify(item) : item)).join(' '),
      level
    )
  );
};

export default reducer;

export const log = {
  info: createLog('info'),
  error: createLog('error'),
  warn: createLog('warn'),
};

export const getLogs = keySels.data;
