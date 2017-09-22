import { combineReducers } from 'redux';
import app from './modules/app';
import projects from './modules/projects';
import logs from './modules/logs';

export default combineReducers({
  app,
  projects,
  logs,
});
