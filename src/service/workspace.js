import { WORKSPACE, DEMO_WORKSPACE_PATH } from '../constants';
const fse = require('fs-extra');
const path = require('path');

export async function isWorkspaceInit() {
  return await fse.exists(path.join(WORKSPACE, 'package.json'));
}

export async function initWorkspace({ overwrite = false } = {}) {
  await fse.copy(DEMO_WORKSPACE_PATH, WORKSPACE, {
    overwrite,
  });
  return WORKSPACE;
}
