import winston from 'winston';

export const defaultTransports = [
  new winston.transports.File({
    name: 'all-file',
    filename: 'logs/all.log',
    level: 'debug'
  })
];
const defaultFilters = [];
const defaultRewriters = [];

class LoggerFactory extends winston.Container {
  constructor(...args): LoggerFactory {
    super(...args)
    this.default = {
      transports: defaultTransports,
      filters: defaultFilters,
      rewriters: defaultRewriters
    };
  }
}

export default new LoggerFactory();

export {
  defaultTransports,
  defaultFilters,
  defaultRewriters
};
