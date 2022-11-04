import test from 'ava'
import modernErrorsWinston from 'modern-errors-winston'

test('Dummy test', (t) => {
  t.true(modernErrorsWinston(true))
})
