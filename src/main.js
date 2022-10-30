import { getOptions } from './options.js'
import { shortFormat, fullFormat } from './static.js'

export default {
  name: 'winston',
  getOptions,
  staticMethods: { shortFormat, fullFormat },
}
