import merge from 'lodash-es/merge';

const { spawn } = require('child_process');

const ENV = require('electron').remote.require('./env');
const PATH = ENV.PATH;

const defaultOption = {
  env: {
    PATH,
  },
};

export default class Command {
  constructor(command, args, { onStdout, onStderr, ...option } = {}) {
    this.command = command;
    this.args = args;
    this.onStdout = onStdout;
    this.onStderr = onStderr;
    this.option = option;
    this.running = null;
  }

  debugRun() {
    const mergedOption = merge({}, defaultOption, this.option);
    console.log(`run ${this.command} ${this.args.join(' ')} with ${JSON.stringify(mergedOption)}`);
    return Promise.resolve(0);
  }

  getPid() {
    return this.running.pid;
  }

  run({
    onExit,
    onError,
  }) {
    // let stdout = Buffer.from([]);
    // let stderr = Buffer.from([]);
    if (this.running !== null) {
      this.running.kill();
    }

    const mergedOption = merge({}, defaultOption, this.option);
    // console.log(this.command, this.args);
    this.running = spawn(this.command, this.args, mergedOption);

    this.running.stdout.on('data', data => {
      if (this.onStdout) {
        this.onStdout(data.toString());
      } else {
        console.log(`%c${data.toString()}`, 'color: green');
      }
    });

    this.running.stderr.on('data', data => {
      if (this.onStderr) {
        this.onStderr(data.toString());
      } else {
        console.log(`%c${data.toString()}`, 'color: red');
      }
      // stderr = Buffer.concat([stderr, data]);
    });

    this.running.on('error', err => {
      onError(err);
    });

    this.running.on('exit', code => {
      if (code !== null && code !== 0) {
        onError(new Error(`process fail with code: ${code}\n}`));
        return;
      }

      onExit();
    });
    return this;
  }

  stop() {
    this.running.kill();
  }
}
