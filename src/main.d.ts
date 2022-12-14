import type { Info } from 'modern-errors'
import type { Format, Options as FormatOptions } from 'winston-error-format'

/**
 * Winston format.
 */
export type { Format }

/**
 * `modern-errors-winston` options
 */
export type Options = Omit<FormatOptions, 'transform'>

/**
 * `modern-errors-winston` plugin (Node.js only).
 *
 * This adds `BaseError.fullFormat()` and `BaseError.shortFormat()` which
 * return a
 * [format](https://github.com/winstonjs/winston/blob/master/README.md#formats)
 * to improve error logging with Winston.
 */
declare const plugin: {
  name: 'winston'
  getOptions: (input: Options) => Options
  staticMethods: {
    /**
     * Returns a logger
     * [`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
     * to [combine](https://github.com/winstonjs/winston#combining-formats) with
     * [`format.json()`](https://github.com/winstonjs/logform#json) or
     * [`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint).
     * This logs all error properties, making it useful with
     * [transports](https://github.com/winstonjs/winston#transports) like
     * [HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).
     *
     * Errors should be logged using
     * [`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
     *
     * @example
     * ```js
     * import { createLogger, transports, format } from 'winston'
     *
     * const logger = createLogger({
     *   format: format.combine(BaseError.fullFormat(), format.json()),
     *   transports: [new transports.Http(httpOptions)],
     * })
     *
     * const error = new InputError('Could not read file.', { props: { filePath } })
     * logger.error(error)
     * // Sent via HTTP:
     * // {
     * //   level: 'error',
     * //   name: 'InputError',
     * //   message: 'Could not read file.',
     * //   stack: `InputError: Could not read file.
     * //     at ...`,
     * //   filePath: '/...',
     * // }
     * ```
     */
    fullFormat: (info: Info['staticMethods']) => Format

    /**
     * Returns a logger
     * [`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
     * to [combine](https://github.com/winstonjs/winston#combining-formats) with
     * [`format.simple()`](https://github.com/winstonjs/logform#simple) or
     * [`format.cli()`](https://github.com/winstonjs/logform#cli). This logs
     * only the error `name`, `message` and `stack`, making it useful with
     * [transports](https://github.com/winstonjs/winston#transports) like the
     * [console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).
     *
     * Errors should be logged using
     * [`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
     *
     * @example
     * ```js
     * import { createLogger, transports, format } from 'winston'
     *
     * const logger = createLogger({
     *   format: format.combine(BaseError.shortFormat(), format.cli()),
     *   transports: [new transports.Console()],
     * })
     *
     * const error = new InputError('Could not read file.', { props: { filePath } })
     * logger.error(error)
     * // Printed on the console:
     * // error: InputError: Could not read file.
     * //     at ...
     * ```
     */
    shortFormat: (info: Info['staticMethods']) => Format
  }
}
export default plugin
