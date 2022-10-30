<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors_dark.svg"/>
  <img alt="modern-errors logo" src="https://raw.githubusercontent.com/ehmicky/design/main/modern-errors/modern-errors.svg" width="600"/>
</picture>

[![Codecov](https://img.shields.io/codecov/c/github/ehmicky/modern-errors-winston.svg?label=tested&logo=codecov)](https://codecov.io/gh/ehmicky/modern-errors-winston)
[![TypeScript](https://img.shields.io/badge/-typed-brightgreen?logo=typescript&colorA=gray&logoColor=0096ff)](/types/main.d.ts)
[![Node](https://img.shields.io/node/v/modern-errors-winston.svg?logo=node.js&logoColor=66cc33)](https://www.npmjs.com/package/modern-errors-winston)
[![Twitter](https://img.shields.io/badge/%E2%80%8B-twitter-brightgreen.svg?logo=twitter)](https://twitter.com/intent/follow?screen_name=ehmicky)
[![Medium](https://img.shields.io/badge/%E2%80%8B-medium-brightgreen.svg?logo=medium)](https://medium.com/@ehmicky)

[`modern-errors`](https://github.com/ehmicky/modern-errors) plugin for Winston.

This adds [`AnyError.fullFormat()`](#anyerrorfullformat) and
[`AnyError.shortFormat()`](#anyerrorshortformat) which return a format to
improve error logging with [Winston](https://github.com/winstonjs/winston).

# Features

# Example

[Adding the plugin](https://github.com/ehmicky/modern-errors#adding-plugins) to
[`modern-errors`](https://github.com/ehmicky/modern-errors).

```js
import modernErrors from 'modern-errors'
import modernErrorsWinston from 'modern-errors-winston'

export const AnyError = modernErrors([modernErrorsWinston])
// ...
```

Full

```js
import { createLogger, transports, format } from 'winston'

const logger = createLogger({
  transports: [new transports.Http(httpOptions)],
  format: format.combine(AnyError.fullFormat(), format.json()),
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

Short

```js
const logger = createLogger({
  transports: [new transports.Console()],
  format: format.combine(AnyError.shortFormat(), format.cli()),
})

const error = new InputError('Could not read file.', { props: { filePath } })
logger.error(error)
// error:   InputError: Could not read file.
//     at ...
```

# Install

```bash
npm install modern-errors-winston
```

This package requires Node.js. It is an ES module and must be loaded using
[an `import` or `import()` statement](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c),
not `require()`.

# API

## modernErrorsWinston

_Type_: `Plugin`

Plugin object to
[pass to `modernErrors()`](https://github.com/ehmicky/modern-errors#adding-plugins).

## AnyError.fullFormat()

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
[`winston.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## AnyError.shortFormat()

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
[`winston.error(error)`](https://github.com/winstonjs/winston/blob/master/README.md#creating-your-own-logger).

## Options

_Type_: `object`

### level

_Type_: `string`\
_Default_: `error`

Log [level](https://github.com/winstonjs/winston#logging-levels).

### stack

_Type_: `boolean`

Whether to log the stack trace.

By default, this is `true` if the error (or one of its
[inner](https://github.com/ehmicky/modern-errors/README.md#wrap-errors) errors)
is
[_unknown_](https://github.com/ehmicky/modern-errors/README.md#unknown-errors),
and `false` otherwise.

## Configuration

[Options](#options) can apply to (in priority order):

- Any error: second argument to
  [`modernErrors()`](https://github.com/ehmicky/modern-errors#modernerrorsplugins-options)

```js
export const AnyError = modernErrors(plugins, { winston: { ...options } })
```

- Any error of multiple classes: using
  [`ErrorClass.subclass()`](https://github.com/ehmicky/modern-errors#anyerrorsubclassname-options)

```js
export const SharedError = AnyError.subclass('SharedError', {
  winston: { ...options },
})

export const InputError = SharedError.subclass('InputError')
export const AuthError = SharedError.subclass('AuthError')
```

- Any error of a specific class: second argument to
  [`AnyError.subclass()`](https://github.com/ehmicky/modern-errors#anyerrorsubclassname-options)

```js
export const InputError = AnyError.subclass('InputError', {
  winston: { ...options },
})
```

- A specific error: second argument to the error's constructor

```js
throw new InputError('...', { winston: { ...options } })
```

- A specific [`AnyError.fullFormat()`](#anyerrorfullformat) or
  [`AnyError.shortFormat()`](#anyerrorshortformat) call

```js
AnyError.fullFormat(...args, { ...options })
```

# Related projects

- [`winston`](https://github.com/winstonjs/winston): A logger for just about
  everything
- [`error-serializer`](https://github.com/ehmicky/error-serializer): Convert
  errors to/from plain objects
- [`modern-errors`](https://github.com/ehmicky/modern-errors): Handle errors
  like it's 2022 🔮
- [`modern-errors-cli`](https://github.com/ehmicky/modern-errors-cli): Handle
  errors in CLI modules
- [`modern-errors-process`](https://github.com/ehmicky/modern-errors-process):
  Handle process errors
- [`modern-errors-bugs`](https://github.com/ehmicky/modern-errors-bugs): Print
  where to report bugs
- [`modern-errors-serialize`](https://github.com/ehmicky/modern-errors-serialize):
  Serialize/parse errors
- [`modern-errors-stack`](https://github.com/ehmicky/modern-errors-stack): Clean
  stack traces
- [`modern-errors-http`](https://github.com/ehmicky/modern-errors-http): Create
  HTTP error responses

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
<table><tr><td align="center"><a href="https://twitter.com/ehmicky"><img src="https://avatars2.githubusercontent.com/u/8136211?v=4" width="100px;" alt="ehmicky"/><br /><sub><b>ehmicky</b></sub></a><br /><a href="https://github.com/ehmicky/modern-errors-winston/commits?author=ehmicky" title="Code">💻</a> <a href="#design-ehmicky" title="Design">🎨</a> <a href="#ideas-ehmicky" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ehmicky/modern-errors-winston/commits?author=ehmicky" title="Documentation">📖</a></td></tr></table>
 -->
<!-- ALL-CONTRIBUTORS-LIST:END -->
