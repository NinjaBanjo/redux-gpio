/* @flow */
import winston from 'winston';

const allTransport:any = new winston.transports.File({
  name: 'all-file',
  filename: 'logs/all.log',
  level: 'debug'
});

const defaultTransports = [
  allTransport
];
const defaultFilters = [];
const defaultRewriters = [];

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
