import test from 'ava'
import { each } from 'test-each'

import { BaseError, testLevel, knownError } from './helpers/main.js'

each(
  [
    true,
    { unknown: true },
    { level: true },
    { level: 'unknown' },
    { stack: 'true' },
  ],
  ({ title }, winston) => {
    test(`Option are validated | ${title}`, (t) => {
      t.throws(BaseError.subclass.bind(BaseError, 'OtherError', { winston }))
    })
  },
)

test('Can pass options to static methods', (t) => {
  t.is(
    BaseError.shortFormat({ level: testLevel }).transform(knownError).level,
    testLevel,
  )
})
