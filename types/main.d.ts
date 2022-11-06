import type { Format } from 'logform'

import type { Info } from 'modern-errors'

/**
 * Winston format.
 */
export type { Format }

/**
 * Options of `modern-errors-winston`
 */
export interface Options {
  /**
   * Log [level](https://github.com/winstonjs/winston#logging-levels).
   *
   * @default 'error'
   */
  readonly level?: string

  /**
   * Whether to log the stack trace.
   *
   * @default `true`
   */
  readonly stack?: boolean
}

/**
 * `modern-errors-winston` plugin (Node.js only).
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
     * [`logger.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
     *
     * @example
     * ```js
     * import { createLogger, transports, format } from 'winston'
     *
     * const logger = createLogger({
     *   format: format.combine(AnyError.fullFormat(), format.json()),
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
     * only the error name, message and stack, making it useful with
     * [transports](https://github.com/winstonjs/winston#transports) like the
     * [console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).
     *
     * Errors should be logged using
     * [`logger.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).
     *
     * @example
     * ```js
     * import { createLogger, transports, format } from 'winston'
     *
     * const logger = createLogger({
     *   format: format.combine(AnyError.shortFormat(), format.cli()),
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
