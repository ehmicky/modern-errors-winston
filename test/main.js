import test from 'ava'
import { each } from 'test-each'

import {
  BaseError,
  testLevel,
  defaultLevel,
  shortLog,
  fullLog,
} from './helpers/main.js'

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
