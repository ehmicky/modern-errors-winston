import test from 'ava'
import { each } from 'test-each'

import {
  TestError,
  BaseError,
  defaultLevel,
  testLevel,
  knownError,
  warnError,
  noStackError,
} from './helpers/main.js'

const { transform } = BaseError.shortFormat()

test('Sets level to error by default', (t) => {
  t.is(transform(knownError).level, defaultLevel)
})

test('Can set other level', (t) => {
  t.is(transform(warnError).level, testLevel)
})

test('Does not use the stack if "stack" is false', (t) => {
  t.is(
    transform(noStackError).message,
    `${noStackError.name}: ${noStackError.message}`,
  )
})

test('Use the stack by default', (t) => {
  t.is(transform(knownError).message, knownError.stack)
})

each(['name', 'message'], ({ title }, propName) => {
  test(`Use the prepended stack if "stack" is true and it misses the name or message | ${title}`, (t) => {
    const error = new TestError('message')
    // TODO: use string.replaceAll() after dropping support for Node <15.0.0
    error.stack = error.stack.replace(new RegExp(error[propName], 'gu'), '')
    t.is(
      transform(error).message,
      `${error.name}: ${error.message}\n${error.stack}`,
    )
  })
})
