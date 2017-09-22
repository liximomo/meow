// import { createSelector, createStructuredSelector } from 'reselect';
// import dotProp from 'dot-prop-immutable';

import { initWorkspace } from '../service/workspace';
import createReducer from '../utils/createReducer';
import createAction from '../utils/createAction';
import createKeysSelector from '../utils/createKeysSelector';
// import get from '../utils/get';

const INIT_APP = 'INIT_APP';
const RESET_WORKSAPE = 'RESET_WORKSAPE';

const initState = {
  isInit: false,
  error: false,
};

const reducer = createReducer(initState, {
  [INIT_APP](state, action) {
    if (action.error) {
      return {
        ...state,
        error: action.payload,
      };
    }

    return {
      ...state,
      isInit: true,
    };
  },
  [RESET_WORKSAPE](state, action) {
    return {
      ...state,
      isInit: false,
    };
  },
});

const keySels = createKeysSelector(initState, 'app');

export default reducer;

export const initApp = createAction(INIT_APP, async option => {
  const workspace = await initWorkspace(option);
  return workspace;
});

export const setWorkpaceUnInited = createAction(RESET_WORKSAPE);

export const resetWorksapce = _ => dispatch => {
  dispatch(setWorkpaceUnInited());
  dispatch(
    initApp({
      overwrite: true,
    })
  );
};

export const isInit = keySels.isInit;

// export const getProjects = createSelector(keySels.byId, toProjectList);
