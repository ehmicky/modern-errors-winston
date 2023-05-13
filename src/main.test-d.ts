import ModernError from 'modern-errors'
import { expectType, expectAssignable, expectNotAssignable } from 'tsd'
import { createLogger } from 'winston'

import modernErrorsWinston, {
  type Options,
  type Format,
} from 'modern-errors-winston'

const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
})
const fullFormat = BaseError.fullFormat()
const shortFormat = BaseError.shortFormat()

ModernError.subclass('TestError', {
  plugins: [modernErrorsWinston],
  winston: {},
})
BaseError.fullFormat({})
BaseError.shortFormat({})
expectAssignable<Options>({})
// @ts-expect-error
BaseError.fullFormat(undefined)
// @ts-expect-error
BaseError.shortFormat(undefined)
expectNotAssignable<Options>(undefined)
ModernError.subclass('TestError', {
  plugins: [modernErrorsWinston],
  // @ts-expect-error
  winston: true,
})
// @ts-expect-error
BaseError.fullFormat(true)
// @ts-expect-error
BaseError.shortFormat(true)
expectNotAssignable<Options>(true)
ModernError.subclass('TestError', {
  plugins: [modernErrorsWinston],
  // @ts-expect-error
  winston: { unknown: true },
})
// @ts-expect-error
BaseError.fullFormat({ unknown: true })
// @ts-expect-error
BaseError.shortFormat({ unknown: true })
expectNotAssignable<Options>({ unknown: true })

ModernError.subclass('TestError', {
  plugins: [modernErrorsWinston],
  winston: { stack: true },
})
BaseError.fullFormat({ stack: true })
BaseError.shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
ModernError.subclass('TestError', {
  plugins: [modernErrorsWinston],
  // @ts-expect-error
  winston: { stack: 'true' },
})
// @ts-expect-error
BaseError.fullFormat({ stack: 'true' })
// @ts-expect-error
BaseError.shortFormat({ stack: 'true' })
expectNotAssignable<Options>({ stack: 'true' })

expectType<Format>(fullFormat)
expectType<Format>(shortFormat)

createLogger({ format: fullFormat })
createLogger({ format: shortFormat })
