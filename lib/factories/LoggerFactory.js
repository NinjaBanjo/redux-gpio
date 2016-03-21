/* @flow */
import winston from 'winston';

const allTransport:mixed = new winston.transports.File({
  name: 'all-file',
  filename: 'logs/all.log',
  level: 'debug'
});

const defaultTransports: Array<mixed> = [
  allTransport
];
const defaultFilters: Array<mixed> = [];
const defaultRewriters: Array<mixed> = [];

class LoggerFactory extends winston.Container {
  constructor(): LoggerFactory {
    super(...arguments);
    this.default = {
      transports: defaultTransports,
      filters: defaultFilters,
      rewriters: defaultRewriters
    };

    return this;
  }
}

export default new LoggerFactory();

export {
  defaultTransports,
  defaultFilters,
  defaultRewriters
};
