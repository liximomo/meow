import { createSelector, createStructuredSelector } from 'reselect';
import dotProp from 'dot-prop-immutable';

import { initProjects, remove, defaultProjectConifg } from '../service/project';
import createCommand from '../service/createCommand';
import createReducer from '../utils/createReducer';
import createAction from '../utils/createAction';
import compose from '../utils/compose';
import createKeysSelector from '../utils/createKeysSelector';
import get from '../utils/get';

const { ipcRenderer } = require('electron')

const ADD_PROJECTS = 'ADD_PROJECTS';
const DEL_PROJECTS = 'DEL_PROJECTS';
const UPDATE_PROJECTS = 'UPDATE_PROJECTS';
const RETRIVE_PROJECTS = 'RETRIVE_PROJECTS';
const CHANGE_ACITVE_PROJECTS = 'CHANGE_ACITVE_PROJECTS';
const RUN_PROJECT = 'RUN_PROJECT';
const CLEAR_RUNNING_STATUS = 'CLEAR_RUNNING_STATUS';

// TODO 关联 pid, 而不是不可序列化的 cmd
const cmds = {};

const initState = {
  search: {},
  activeId: null,
  byId: {},
  infoById: {},
};

const keySels = createKeysSelector(initState, 'projects');

const reducer = createReducer(initState, {
  [ADD_PROJECTS](state, action) {
    if (action.error) {
      return state;
    }

    const project = action.payload;
    const byId = state.byId;

    if (byId[project.id]) {
      action.payload = new Error('已存在同名项目！');
      action.error = true;
      return state;
    }

    return {
      ...state,
      byId: {
        ...byId,
        [project.id]: project,
      },
      activeId: project.id,
    };
  },
  [DEL_PROJECTS](state, action) {
    return dotProp.delete(state, `byId.${action.payload}`);
  },
  [UPDATE_PROJECTS](state, action) {
    const update = action.payload;
    return dotProp.set(state, `byId.${update.id}`, ori => ({
      ...ori,
      ...update,
    }));
  },
  [CHANGE_ACITVE_PROJECTS](state, action) {
    return {
      ...state,
      activeId: action.payload,
    };
  },
  [RUN_PROJECT](state, action) {
    const {
      id,
      pid,
    } = action.payload;

    const interState = dotProp.set(state, `infoById.${id}`, ori => ({
      ...ori,
      running: {
        pid,
      },
    }))
    
    return dotProp.set(interState, `byId.${id}`, ori => ({
      ...ori,
      activieDate: new Date().getTime(),
    }));
  },
  [CLEAR_RUNNING_STATUS](state, action) {
    const {
      id,
    } = action.payload;

    return dotProp.set(state, `infoById.${id}`, ori => ({
      ...ori,
      running: null,
    }));
  },
  [RETRIVE_PROJECTS](state, action) {
    return {
      ...state,
      search: action.payload,
    };
  },
});

function sortBy(key) {
  return projects =>
    projects.sort((l, r) => {
      return get(r, key, 0) - get(l, key, 0);
    });
}

function objValuesBy(getIds) {
  return projects => {
    const ids = typeof getIds === 'function' ? getIds(projects) : getIds;
    return ids.map(id => projects[id]).sort((l, r) => {
      return get(r, 'activieDate', 0) - get(l, 'activieDate', 0);
    });
  };
}

const objToArray = objValuesBy(Object.keys.bind(Object));

const valuesSortByCreateDate = compose(sortBy('createDate'), objToArray);

export default reducer;

export const addProject = createAction(ADD_PROJECTS, async name => {
  const project = await initProjects(name.trim());
  return project;
});
export const removeProjectFromState = createAction(DEL_PROJECTS);
export const delProject = project => dispatch => {
  remove(project);
  dispatch(removeProjectFromState(project.id));
};
export const updateProject = createAction(UPDATE_PROJECTS, (id, update) => ({
  id,
  ...update,
}));

export const changeActiveProject = createAction(CHANGE_ACITVE_PROJECTS);
export const retriveProjects = createAction(RETRIVE_PROJECTS);

export const runProjectAction = createAction(RUN_PROJECT, payload => {
  ipcRenderer.send('running-process', payload.pid);
  return payload;
});
export const clearRunnStatus = createAction(CLEAR_RUNNING_STATUS, payload => {
  ipcRenderer.send('stop-process', payload.pid);
  return payload;
});
export const stopProject = project => dispatch => {
  const cmd = cmds[project.id];
  if (!cmd) {
    console.warn('企图停止不存在的任务！');
  }

  const pid = cmd.getPid();
  cmd.stop();
  delete cmds[project.id];

  dispatch(clearRunnStatus({
    id: project.id,
    pid,
  }));
};

export const stopRunningProjects = _ => (dispatch, getState) => {
  const state = getState();
  getRunningProjects(state).forEach(project => dispatch(stopProject(project)));
};

export const runProject = (projectId, scriptName) => (dispatch, getState) => {
  const state = getState();
  const project = keySels.byId(state)[projectId];
  dispatch(stopRunningProjects());
  const cmd = createCommand(project, scriptName);
  let pid;
  cmd.run({
    onExit: _ => dispatch(clearRunnStatus({
      id: project.id,
      pid,
    })),
    onError: _ => dispatch(stopProject(project)),
  });
  cmds[project.id] = cmd;
  pid = cmd.getPid();

  dispatch(runProjectAction({
    id: project.id,
    pid,
  }));
};

keySels.byId = createSelector(keySels.byId, byId =>
  Object.keys(byId).reduce((result, id) => {
    result[id] = {
      ...defaultProjectConifg,
      ...byId[id],
    };
    return result;
  }, {})
);

export const getProjects = createSelector(keySels.byId, keySels.search, (projectsById, search) =>
  valuesSortByCreateDate(projectsById).filter(p => {
    for (let key in search) {
      const val = p[key];
      const searchVal = search[key];
      if (typeof val === 'string') {
        if (searchVal !== '' && !~val.indexOf(searchVal)) {
          return false;
        }
      } else {
        // eslint-disable-next-line eqeqeq
        if (val != searchVal) {
          return false;
        }
      }
    }
    return true;
  })
);

export const getProjectInfos = keySels.infoById;

export const getRunningProjects = createSelector(
  keySels.byId,
  keySels.infoById,
  compose(sortBy('activieDate'), (byId, infoById) =>
    objValuesBy(
      Object.keys(infoById).reduce((ids, id) => {
        if (infoById[id].running) {
          ids.push(id);
        }
        return ids;
      }, [])
    )(byId)
  )
);

export const getProjectsListView = createStructuredSelector({
  activeId: keySels.activeId,
  projects: getProjects,
  projectInfos: getProjectInfos,
  runningProjects: getRunningProjects,
});

export const getActiveProject = createSelector(
  keySels.byId,
  keySels.activeId,
  (projects, activeId) => {
    return projects[activeId];
  }
);
