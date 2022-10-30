import modernErrors from 'modern-errors'
import modernErrorsWinston, { Options, Format } from 'modern-errors-winston'
import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'
import { createLogger } from 'winston'

const AnyError = modernErrors([modernErrorsWinston])
const fullFormat = AnyError.fullFormat()
const shortFormat = AnyError.shortFormat()

modernErrors([modernErrorsWinston], { winston: {} })
AnyError.fullFormat({})
AnyError.shortFormat({})
expectAssignable<Options>({})
expectError(AnyError.fullFormat(undefined))
expectError(AnyError.shortFormat(undefined))
expectNotAssignable<Options>(undefined)
expectError(modernErrors([modernErrorsWinston], { winston: true }))
expectError(AnyError.fullFormat(true))
expectError(AnyError.shortFormat(true))
expectNotAssignable<Options>(true)
expectError(modernErrors([modernErrorsWinston], { winston: { unknown: true } }))
expectError(AnyError.fullFormat({ unknown: true }))
expectError(AnyError.shortFormat({ unknown: true }))
expectNotAssignable<Options>({ unknown: true })

modernErrors([modernErrorsWinston], { winston: { level: 'error' } })
AnyError.fullFormat({ level: 'error' })
AnyError.shortFormat({ level: 'error' })
expectAssignable<Options>({ level: 'error' })
expectError(modernErrors([modernErrorsWinston], { winston: { level: true } }))
expectError(AnyError.fullFormat({ level: true }))
expectError(AnyError.shortFormat({ level: true }))
expectNotAssignable<Options>({ level: true })

modernErrors([modernErrorsWinston], { winston: { stack: true } })
AnyError.fullFormat({ stack: true })
AnyError.shortFormat({ stack: true })
expectAssignable<Options>({ stack: true })
expectError(modernErrors([modernErrorsWinston], { winston: { stack: 'true' } }))
expectError(AnyError.fullFormat({ stack: 'true' }))
expectError(AnyError.shortFormat({ stack: 'true' }))
expectNotAssignable<Options>({ stack: 'true' })

expectType<Format>(fullFormat)
expectType<Format>(shortFormat)

createLogger({ format: fullFormat })
createLogger({ format: shortFormat })
