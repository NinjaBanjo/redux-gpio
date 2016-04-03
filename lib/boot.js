/* @flow */
import App from './app';

import { makeStore } from './store';

import wpi from 'wiring-pi';

// detemine what env we are supposed to run in
const env = (process.env['NODE_ENV'] === 'production' ? App.ENV_PROD : App.ENV_DEV);

// We have to run as root to setup gpio pins with wiring-pi;
// After doing that, we de-escelate permissions to the user that called sudo (hopefully not root)
if (process.getuid && process.setuid && process.setgid) {
  const currentUid = process.getuid();
  const sudoUid = process.env['SUDO_UID'];
  const sudoGid = process.env['SUDO_GID'];
  if(currentUid !== 0 || !sudoUid || !sudoGid) { // if not root
    throw new Error('You must start this app with sudo');
  }

  if(sudoUid === 0 || sudoGid === 0) {
    throw new Error('Must call sudo as non-root user so the process can run as a non-root user');
  }
  // We are currently running as root, do only what we need to
  wpi.setup('gpio'); // this exports all gpio pins for us (why we need root)
  // try switching to running under a non-root user
  try {
    console.log(sudoUid);
    process.setgid(Number(sudoGid)); // note setgid first, otherwise no permission to change once we switch uid
    process.setuid(Number(sudoUid));
    console.log(`Now running as uid:${sudoUid} and gid:${sudoGid}`);
  } catch (ex) {
    console.log(ex);
    process.exit(1);
  }
} else {
  throw new Error('This program can only run on POSIX systems');
}

// Set the store that the app will use
App.setStore(makeStore());

// start the app in that env
App.init(env);
