import modernErrors from 'modern-errors'
import modernErrorsWinston, { Options, Format } from 'modern-errors-winston'
import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import { createLogger } from 'winston'

const BaseError = modernErrors([modernErrorsWinston])
const fullFormat = BaseError.fullFormat()
const shortFormat = BaseError.shortFormat()

modernErrors([modernErrorsWinston], { winston: {} })
BaseError.fullFormat({})
BaseError.shortFormat({})
expectAssignable<Options>({})
expectError(BaseError.fullFormat(undefined))
expectError(BaseError.shortFormat(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([modernErrorsWinston], { winston: true }))
expectError(BaseError.fullFormat(true))
expectError(BaseError.shortFormat(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([modernErrorsWinston], { winston: { unknown: true } }))
expectError(BaseError.fullFormat({ unknown: true }))
expectError(BaseError.shortFormat({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

modernErrors([modernErrorsWinston], { winston: { level: 'error' } })
BaseError.fullFormat({ level: 'error' })
BaseError.shortFormat({ level: 'error' })
expectAssignable<Options>({ level: 'error' })
expectError(modernErrors([modernErrorsWinston], { winston: { level: true } }))
expectError(BaseError.fullFormat({ level: true }))
expectError(BaseError.shortFormat({ level: true }))
expectNotAssignable<Options>({ level: true })

modernErrors([modernErrorsWinston], { winston: { stack: true } })
BaseError.fullFormat({ stack: true })
BaseError.shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
expectError(modernErrors([modernErrorsWinston], { winston: { stack: 'true' } }))
expectError(BaseError.fullFormat({ stack: 'true' }))
expectError(BaseError.shortFormat({ stack: 'true' }))
expectNotAssignable<Options>({ stack: 'true' })

expectType<Format>(fullFormat)
expectType<Format>(shortFormat)

createLogger({ format: fullFormat })
createLogger({ format: shortFormat })
