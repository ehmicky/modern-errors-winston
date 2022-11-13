import ModernError from 'modern-errors'
import modernErrorsWinston from 'modern-errors-winston'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
})

export const defaultLevel = 'error'
export const testLevel = 'warn'

export const knownError = new BaseError('test')
export const warnError = new BaseError('test', {
  winston: { level: testLevel },
})
export const noStackError = new BaseError('test', { winston: { stack: false } })

export const shortLog = function (value) {
  shortLogger.error(value)
  return lastShortLog
}

// eslint-disable-next-line fp/no-let
let lastShortLog = ''

const getShortLogger = function () {
  const shortStream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastShortLog = object[MESSAGE]
    done(undefined, object)
  })
  return createLogger({
    format: format.combine(BaseError.shortFormat(), format.simple()),
    transports: [new transports.Stream({ stream: shortStream })],
  })
}

const shortLogger = getShortLogger()

export const fullLog = function (value) {
  fullLogger.error(value)
  return lastFullLog
}

// eslint-disable-next-line fp/no-let
let lastFullLog = {}

const getFullLogger = function () {
  const fullStream = through.obj((object, encoding, done) => {
    // eslint-disable-next-line fp/no-mutation
    lastFullLog = JSON.parse(object[MESSAGE])
    done(undefined, object)
  })
  return createLogger({
    format: format.combine(BaseError.fullFormat(), format.json()),
    transports: [new transports.Stream({ stream: fullStream })],
  })
}

const fullLogger = getFullLogger()
