import { runInNewContext } from 'node:vm'

import test from 'ava'
import { each } from 'test-each'
import { LEVEL } from 'triple-beam'

import {
  TestError,
  AnyError,
  defaultLevel,
  testLevel,
  knownError,
  warnError,
  noStackError,
} from './helpers/main.js'

const { transform } = AnyError.fullFormat()

test('Does not use the stack if "stack" is false', (t) => {
  t.false('stack' in transform(noStackError))
})

test('Use the stack by default', (t) => {
  t.is(transform(knownError).stack, knownError.stack)
})

test('Default value for "stack" is deep', (t) => {
  const error = new TestError('test', {
    winston: { stack: false },
    errors: [knownError],
  })
  const object = transform(error)
  t.is(object.stack, undefined)
  t.is(object.errors[0].stack, error.errors[0].stack)
})

test('Can set other level', (t) => {
  t.is(transform(warnError).level, testLevel)
})

test('Sets level to error by default', (t) => {
  t.is(transform(knownError).level, defaultLevel)
})

each([Error, runInNewContext('Error')], ({ title }, ErrorClass) => {
  test(`Normalizes unknown error | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.is(transform(error).name, 'UnknownError')
  })
})

test('Does not include constructorArgs', (t) => {
  t.false('constructorArgs' in transform(warnError))
})

test('Serializes error', (t) => {
  const { name, message, stack } = knownError
  t.deepEqual(transform(knownError), {
    level: defaultLevel,
    [LEVEL]: defaultLevel,
    name,
    message,
    stack,
  })
})

test('Serializes error properties', (t) => {
  const error = new TestError('test', { props: { prop: true } })
  t.true(transform(error).prop)
})

test('Ignore JSON-unsafe error properties', (t) => {
  const error = new TestError('test', { props: { prop: 0n } })
  t.false('prop' in transform(error))
})

test('Serializes error properties deeply', (t) => {
  const error = new TestError('test', { props: { prop: knownError } })
  t.is(transform(error).prop.message, knownError.message)
})

test('Serializes aggregate errors deeply', (t) => {
  const error = new TestError('test', { errors: [knownError] })
  t.is(transform(error).errors[0].message, error.errors[0].message)
})
