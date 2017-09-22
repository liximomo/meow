import { WORKSPACE } from '../constants';
import Command from './Command';
import { log } from '../modules/logs';

export default function createCommand(project, scriptName) {
  const isProd = scriptName === 'build';
  const cmd = new Command('npm', ['run', scriptName], {
    onStderr: log.error,
    onStdout: log.info,
    cwd: WORKSPACE,
    env: {
      PORT: 7000,
      MOBUILD_PORJECT_NAME: project.name,
      MOBUILD_PORJECT: JSON.stringify(project),
      ...(isProd ? { PUBLIC_URL: project.publicPath } : {}),
    },
  });
  return cmd;
}
