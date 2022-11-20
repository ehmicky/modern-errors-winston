import ModernError from 'modern-errors'
import modernErrorsWinston from 'modern-errors-winston'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
})
export const testLevel = 'warn'
export const defaultLevel = 'error'

export const shortLog = function (value) {
  // eslint-disable-next-line fp/no-let
  let lastLog = ''
  const stream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastLog = object[MESSAGE]
    done(undefined, object)
  })
  const logger = createLogger({
    format: format.combine(BaseError.shortFormat(), format.simple()),
    transports: [new transports.Stream({ stream })],
  })
  logger.error(value)
  return lastLog
}

export const fullLog = function (value) {
  // eslint-disable-next-line fp/no-let
  let lastLog = {}
  const stream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastLog = JSON.parse(object[MESSAGE])
    done(undefined, object)
  })
  const logger = createLogger({
    format: format.combine(BaseError.fullFormat(), format.json()),
    transports: [new transports.Stream({ stream })],
  })
  logger.error(value)
  return lastLog
}
