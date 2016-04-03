/* @flow */
import process from 'process';

import wpi from 'wiring-pi';

export type ExitTaskFn = () => void;

export type CleanupTaskFn = () => ?Promise;

const exitTasks = new Set();
const cleanupTasks = new Set();
const exitHandlersRegistered = false;

export function setup() {
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
}

export function registerExitTask(fn: ExitTaskFn): void {
  exitTasks.add(fn);
}

export function unregisterExitTask(fn: ExitTaskFn): boolean {
  return exitTasks.delete(fn);
}

export function registerCleanupTask(fn: CleanupTaskFn): void {
  cleanupTasks.add(fn);
}

export function unregisterCleanupTask(fn: CleanupTaskFn): boolean {
  return cleanupTasks.delete(fn);
}

export async function exitCleanly(): Promise<?Error> {
  console.log('Exiting...');
  try {
    await runCleanupTasks();

    return cleanExitSuccess();
  } catch (ex) {
    return cleanExitFail(ex);
  }
}

export function registerProcessHandlers() {
  // User initiated exits
  process.on('SIGTERM', exitCleanly);
  process.on('SIGINT', exitCleanly);

  // Other initiated events
  process.on('SIGHUP', exitCleanly);

  // When someone else calls exit
  process.on('exit', onExit);
}

async function runCleanupTasks() {
  try {
    const cleanupPromiseArr = [];
    // Run cleanup tasks, they can return a promise
    cleanupTasks.forEach((e: CleanupTaskFn): void => {
      var output = e();
      if(output && typeof output.then == 'function') {
        cleanupPromiseArr.push(output);
      }
    });
    // Empty the cleanupTasks
    cleanupTasks.clear();
    await Promise.all(cleanupPromiseArr);
  } catch (ex) {
    console.log('An issue occurred running cleanup tasks');
    console.log(ex);
  }
}

function runExitTasks() {
  exitTasks.forEach((e: ExitTaskFn): void => {
    e();
  });
  // Empty the exitTasks
  exitTasks.clear();
}

function cleanExitFail(ex: Error): void {
    console.log('Failed to exit cleanly.');
    console.log(ex);
    process.exit(1);
}

function cleanExitSuccess(): void {
    console.log('All clean!');
    process.exit(0);
}

function onExit() {
  console.log('process exit called, running exit tasks');
  runExitTasks();
  cleanExitFail(new Error('****Someone else tried to call exit!****'));
}
