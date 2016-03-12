import process from 'process';

const exitTasks = new Set();
const cleanupTasks = new Set();
const exitHandlersRegistered = false;

export function registerExistTask(fn) {
  exitTasks.add(fn);
}

export function unregisterExitTask(fn) {
  return exitTasks.delete(fn);
}

export function registerCleanupTask(fn) {
  cleanupTasks.add(fn);
}

export function unregisterCleanupTask(fn) {
  return cleanupTasks.delete(fn);
}

export async function exitCleanly() {
  console.log('Exiting...');
  try {
    await runCleanupTasks();

    cleanExitSuccess();
  } catch (ex) {
    cleanExitFail(ex);
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
    cleanupTasks.forEach(e => {
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
  exitTasks.forEach(e => {
    e();
  });
  // Empty the exitTasks
  exitTasks.clear();
}

function cleanExitFail(ex) {
    console.log('Failed to exit cleanly.');
    console.log(ex);
    process.exit(1);
}

function cleanExitSuccess() {
    console.log('All clean!');
    process.exit(0);
}

function onExit() {
  console.log('process exit called, running exit tasks');
  runExitTasks();
  cleanExitFail('****Someone else tried to call exit!****');
}
