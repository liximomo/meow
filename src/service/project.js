import { USER_HOME, WORKSPACE, DEMO_PROJECT_PATH } from '../constants';
import hash from '../utils/hash';

const fse = require('fs-extra');
const path = require('path');

export const defaultProjectConifg = {
  publicPath: 'http://7xw10e.com1.z0.glb.clouddn.com/yyActivity/',
  mode: 'dev',
  deploy: true,
  remote_host: 'q1.aliyun.lanyicj.cn',
  remote_port: '30022',
  remote_user: 'xuyh',
  remote_pass: 'xyh19920118',
  remote_contentBase: '/home/y/share/htdocs',
  remote_page: '',
  remote_privateKeyPath: `${USER_HOME}/.ssh/id_rsa`,
};

const getProjectPath = name => path.join(WORKSPACE, 'src/pages', name);
export async function initProjects(name) {
  const projectPath = getProjectPath(name);
  await fse.ensureDir(projectPath);
  await fse.copy(DEMO_PROJECT_PATH, projectPath, {
    overwrite: false,
  });
  return {
    name,
    id: hash(name),
    createDate: new Date().getTime(),
    activieDate: new Date().getTime(),
  };
}

export function remove(project) {
  const projectPath = getProjectPath(project.name);
  fse.removeSync(projectPath);
  return project;
}
