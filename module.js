import { resolve, join } from 'path'
import messenger from './store/messenger'
import breadcrumbs from './store/breadcrumbs'

export default function (options) {
  const settings = Object.assign(
    {
      api: {
        prefix: '/api/'
      },
      modules: [],
    },
    this.options.crud || {},
    options
  )
  // Register the base plugin
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    options: {
      modules: settings.modules.map((module) => module.toObject()),
      api: settings.api,
      store: {
        messenger,
        breadcrumbs
      },
    },
  })

  // Register components
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'c'
    })
  })
}

module.exports.meta = require('./package.json')
