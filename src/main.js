import {
  shortFormat as shortFormatLib,
  fullFormat as fullFormatLib,
  validateOptions,
} from 'winston-error-format'

const getOptions = function (options) {
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
const getFormat = function (formatLib, { errorInfo }) {
  return formatLib(getErrorFormat.bind(undefined, errorInfo))
}

const getErrorFormat = function (errorInfo, error) {
  const {
    options: { level, stack },
    error: errorA,
  } = errorInfo(error)
  return { level, stack, normalize: () => errorA }
}

const shortFormat = getFormat.bind(undefined, shortFormatLib)
const fullFormat = getFormat.bind(undefined, fullFormatLib)

export default {
  name: 'winston',
  getOptions,
  staticMethods: { shortFormat, fullFormat },
}
