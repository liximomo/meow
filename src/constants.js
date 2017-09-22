const { remote } = require('electron');
const path = require('path');
const app = remote.app;

export const APP_PATH = app.getAppPath();
export const USER_HOME = app.getPath('home');
export const WORKSPACE_PATH = USER_HOME;
export const WORKSPACE_NAME = 'meow_workspace';
export const APPDATA_NAME = 'appData.json';
export const WORKSPACE = path.join(WORKSPACE_PATH, WORKSPACE_NAME);
export const APPDATA = path.join(WORKSPACE, APPDATA_NAME);
export const RESOURCE_PATH = path.join(APP_PATH, 'resource');

export const DEMO_WORKSPACE_PATH = path.join(RESOURCE_PATH, 'workspace');
export const DEMO_PROJECT_PATH = path.join(RESOURCE_PATH, 'projects/demo');
