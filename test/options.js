import test from 'ava'
import { each } from 'test-each'

import { TestError, BaseError, testLevel } from './helpers/main.js'

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
  const error = new TestError('test')
  t.is(
    BaseError.shortFormat({ level: testLevel }).transform(error).level,
    testLevel,
  )
})
