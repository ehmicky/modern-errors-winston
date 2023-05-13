import test from 'ava'
import ModernError from 'modern-errors'
import { each } from 'test-each'
import through from 'through2'
import { MESSAGE } from 'triple-beam'
import { createLogger, transports, format } from 'winston'

import modernErrorsWinston from 'modern-errors-winston'

const testLevel = 'warn'
const defaultLevel = 'error'

const shortLog = (value) => {
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

const fullLog = (value) => {
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

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
})

test('Options are validated', (t) => {
  t.throws(
    BaseError.subclass.bind(BaseError, 'TestError', {
      winston: { level: 'true' },
    }),
  )
})

test('Can pass class options', (t) => {
  const TestError = BaseError.subclass('TestError', {
    winston: { stack: false },
  })
  const error = new BaseError('test')
  t.false('stack' in TestError.fullFormat().transform(error))
})

test('Can pass instance options', (t) => {
  const error = new BaseError('test', { winston: { stack: false } })
  t.false('stack' in BaseError.fullFormat().transform(error))
})

test('Can pass deep instance options', (t) => {
  const prop = new BaseError('test', { winston: { stack: false } })
  const error = new BaseError('test', {
    winston: { stack: true },
    props: { prop },
  })
  const object = BaseError.fullFormat().transform(error)
  t.true('stack' in object)
  t.false('stack' in object.prop)
})

test('Can pass method options', (t) => {
  const error = new BaseError('test')
  t.false('stack' in BaseError.fullFormat({ stack: false }).transform(error))
})

test('Can set log level | shortFormat', (t) => {
  const error = new BaseError('test', { winston: { level: testLevel } })
  t.true(shortLog(error).startsWith(testLevel))
})

test('Can set log level | fullFormat', (t) => {
  const error = new BaseError('test', { winston: { level: testLevel } })
  t.is(fullLog(error).level, testLevel)
})

test('Log without stack | shortFormat', (t) => {
  const error = new BaseError('test', { winston: { stack: false } })
  t.is(shortLog(error), `${defaultLevel}: ${error.name}: ${error.message}`)
})

test('Log without stack | fullFormat', (t) => {
  const error = new BaseError('test', { winston: { stack: false } })
  const { name, message } = error
  t.deepEqual(fullLog(error), { level: defaultLevel, name, message })
})

each([Error, BaseError], ({ title }, ErrorClass) => {
  test(`Log with stack | shortFormat | ${title}`, (t) => {
    const error = new ErrorClass('test')
    const { stack } = BaseError.normalize(error)
    t.is(shortLog(error), `${defaultLevel}: ${stack}`)
  })

  test(`Log with stack | fullFormat | ${title}`, (t) => {
    const error = new ErrorClass('test')
    const { name, message, stack } = BaseError.normalize(error)
    t.deepEqual(fullLog(error), { level: defaultLevel, name, message, stack })
  })
})
