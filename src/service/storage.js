import { APPDATA } from '../constants';
const fse = require('fs-extra');
const path = require('path');

fse.ensureDirSync(path.dirname(APPDATA));

export function save(data) {
  fse.writeJson(APPDATA, data, {
    spaces: 2,
  });
}

export function load() {
  if (fse.pathExistsSync(APPDATA)) {
    return fse.readJsonSync(APPDATA);
  }

  return undefined;
}
