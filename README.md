<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Node](https://img.shields.io/badge/-Node.js-808080?logo=node.js&colorA=404040&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors-winston)
[![TypeScript](https://img.shields.io/badge/-Typed-808080?logo=typescript&colorA=404040&logoColor=0096ff)](/types/main.d.ts)
[![Codecov](https://img.shields.io/badge/-Tested%20100%25-808080?logo=codecov&colorA=404040)](https://codecov.io/gh/ehmicky/modern-errors-winston)
[![Mastodon](https://img.shields.io/badge/-Mastodon-808080.svg?logo=mastodon&colorA=404040&logoColor=9590F9)](https://fosstodon.org/@ehmicky)
[![Medium](https://img.shields.io/badge/-Medium-808080.svg?logo=medium&colorA=404040)](https://medium.com/@ehmicky)

[`modern-errors`](https://github.com/ehmicky/modern-errors)
[plugin](https://github.com/ehmicky/modern-errors#-plugins) for
[Winston](https://github.com/winstonjs/winston).

This adds [`BaseError.fullFormat()`](#baseerrorfullformat) and
[`BaseError.shortFormat()`](#baseerrorshortformat) which return a
[format](https://github.com/winstonjs/winston/blob/master/README.md#formats) to
improve error logging with Winston.

# Features

- Error [class/instance-specific](#configuration) log [level](#level) or
  [verbosity](#stack)
- The [full format](#baseerrorfullformat) includes all properties
- The [short format](#baseerrorshortformat) includes only the error's name,
  message and stack
- Works with
  [uncaught exceptions](https://github.com/winstonjs/winston#exceptions)

Unlike Winston's default
[error format](https://github.com/winstonjs/logform#errors):

- The error `name` is logged
- The full format logs nested errors, including
  [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
  and aggregate
  [`errors`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)
- The full format is [JSON-safe](https://github.com/ehmicky/safe-json-value)
- The short format optionally logs the stack trace
- The error instance is not modified

# Example

[Adding the plugin](https://github.com/ehmicky/modern-errors#adding-plugins) to
[`modern-errors`](https://github.com/ehmicky/modern-errors).

```js
import ModernError from 'modern-errors'
import modernErrorsWinston from 'modern-errors-winston'

export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
})
export const InputError = BaseError.subclass('InputError')
// ...
```

Using the [full format](#baseerrorfullformat) with Winston.

```js
import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  format: format.combine(BaseError.fullFormat(), format.json()),
  transports: [new transports.Http(httpOptions)],
})

const error = new InputError('Could not read file.', { props: { filePath } })
logger.error(error)
// Sent via HTTP:
// {
//   level: 'error',
//   name: 'InputError',
//   message: 'Could not read file.',
//   stack: `InputError: Could not read file.
//     at ...`,
//   filePath: '/...',
// }
```

Using the [short format](#baseerrorshortformat) with Winston.

```js
import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  format: format.combine(BaseError.shortFormat(), format.cli()),
  transports: [new transports.Console()],
})

const error = new InputError('Could not read file.', { props: { filePath } })
logger.error(error)
// Printed on the console:
// error: InputError: Could not read file.
//     at ...
```

# Install

```bash
npm install modern-errors-winston
```

This package requires installing [Winston](https://github.com/winstonjs/winston)
separately.

```bash
npm install winston
```

This package works in Node.js >=14.18.0. It is an ES module and must be loaded
using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrorsWinston

_Type_: `Plugin`

Plugin object to pass to the
[`plugins` option](https://github.com/ehmicky/modern-errors#adding-plugins) of
`ErrorClass.subclass()`.

## BaseError.fullFormat()

_Return value_: `Format`

Returns a logger
[`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
to [combine](https://github.com/winstonjs/winston#combining-formats) with
[`format.json()`](https://github.com/winstonjs/logform#json) or
[`format.prettyPrint()`](https://github.com/winstonjs/logform#prettyprint). This
logs all error properties, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like
[HTTP](https://github.com/winstonjs/winston/blob/master/docs/transports.md#http-transport).

Errors should be logged using
[`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## BaseError.shortFormat()

_Return value_: `Format`

Returns a logger
[`format`](https://github.com/winstonjs/winston/blob/master/README.md#formats)
to [combine](https://github.com/winstonjs/winston#combining-formats) with
[`format.simple()`](https://github.com/winstonjs/logform#simple) or
[`format.cli()`](https://github.com/winstonjs/logform#cli). This logs only the
error name, message and stack, making it useful with
[transports](https://github.com/winstonjs/winston#transports) like the
[console](https://github.com/winstonjs/winston/blob/master/docs/transports.md#console-transport).

Errors should be logged using
[`logger.*(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## Options

_Type_: `object`

### stack

_Type_: `boolean`\
_Default_: `true`

Whether to log the stack trace.

### level

_Type_: `string`

Override the log [level](https://github.com/winstonjs/winston#logging-levels).

## Configuration

[Options](#options) can apply to (in priority order):

- Any error: second argument to
  [`ModernError.subclass()`](https://github.com/ehmicky/modern-errors#options-1)

```js
export const BaseError = ModernError.subclass('BaseError', {
  plugins: [modernErrorsWinston],
  winston: options,
})
```

- Any error of a specific class (and its subclasses): second argument to
  [`ErrorClass.subclass()`](https://github.com/ehmicky/modern-errors#options-1)

```js
export const InputError = BaseError.subclass('InputError', { winston: options })
```

- A specific error: second argument to
  [`new ErrorClass()`](https://github.com/ehmicky/modern-errors#options-3)

```js
throw new InputError('...', { winston: options })
```

- A specific [`BaseError.fullFormat()`](#baseerrorfullformat) or
  [`BaseError.shortFormat()`](#baseerrorshortformat) call

```js
BaseError.fullFormat(options)
```

# Related projects

- [`winston`](https://github.com/winstonjs/winston): A logger for just about
  everything
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2023 🔮
- [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli): Handle
  errors in CLI modules
- [`modern-errors-process`](https://github.com/ehmicky/modern-errors-process):
  Handle process errors
- [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs): Print
  where to report bugs
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`modern-errors-clean`](https://github.com/ehmicky/modern-errors-clean): Clean
  stack traces
- [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http): Create
  HTTP error responses
- [`modern-errors-switch`](https://github.com/ehmicky/modern-errors-switch):
  Execute class-specific logic

# Support

For any question, _don't hesitate_ to [submit an issue on GitHub](../../issues).

Everyone is welcome regardless of personal background. We enforce a
[Code of conduct](CODE_OF_CONDUCT.md) in order to promote a positive and
inclusive environment.

# Contributing

This project was made with ❤️. The simplest way to give back is by starring and
sharing it online.

If the documentation is unclear or has a typo, please click on the page's `Edit`
button (pencil icon) and suggest a correction.

If you would like to help us fix a bug or add a new feature, please check our
[guidelines](CONTRIBUTING.md). Pull requests are welcome!

<!-- Thanks go to our wonderful contributors: -->

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- prettier-ignore -->
<!--
<table><tr><td align="center"><a href="https://fosstodon.org/@ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors-winston/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors-winston/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
