import winston from 'winston';

export const defaultTransports = [];
export const defaultFilters = [];
export const defaultRewriters = [];

class LoggerFactory extends winston.Container {
  constructor(...args) {
    super(...args)
  }

  
}

export default new LoggerFactory({
  transports: defaultTransports,
  // filters: defaultFilters,
  // rewriters: defaultRewriters
});
