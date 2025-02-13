import {
  fullFormat as fullFormatLib,
  shortFormat as shortFormatLib,
  validateOptions,
} from 'winston-error-format'

const getOptions = (options = {}) => {
  validateOptions(options)
  return options
}

// Retrieve the Winston formats.
// Those are exposed as static methods, as opposed to using a `log()` instance
// method because:
//  - This allows `exceptionHandlers` to use them
//  - This allows the same error log to use multiple transports using either
//    format
// We do not allow passing method options to static methods because they would
// have higher priority than instance options, which is unexpected.
const getFormat = (formatLib, { errorInfo }) =>
  formatLib(getErrorFormat.bind(undefined, errorInfo))

const getErrorFormat = (errorInfo, error) => {
  const {
    options: { level, stack },
    error: errorA,
  } = errorInfo(error)
  return { level, stack, transform: () => errorA }
}

const shortFormat = getFormat.bind(undefined, shortFormatLib)
const fullFormat = getFormat.bind(undefined, fullFormatLib)

export default {
  name: 'winston',
  getOptions,
  staticMethods: { shortFormat, fullFormat },
}
