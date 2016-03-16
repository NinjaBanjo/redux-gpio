export default () => {
  let shouldError = false;
  let readValue = 0;

  return {
    open(pin, options, cb) {
      cb(getError())
    },
    close(pin, cb) {
      cb(getError())
    },
    write(pin, value, cb) {
      cb(getError())
    },
    read(pin, cb) {
      cb(getError(), value)
    },
    setShouldError(value) {
      shouldError = !!value;
    },
    setReadValue(value) {
      readValue = value;
    }
  };

  function getError() {
    if (shouldError) {
      return new Error();
    } else {
      return null;
    }
  }
}
