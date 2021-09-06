import { resolve, join } from 'path'
import messenger from './store/messenger'
import breadcrumbs from './store/breadcrumbs'

export default function (options) {
  const settings = Object.assign(
    {
      api: {
        prefix: '/api/',
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
        breadcrumbs,
      },
    },
  })

  this.extendRoutes((routes, resolve) => {
    routes.push({
      path: '/c/:module',
      component: resolve(__dirname, 'pages/index'),
      props: {
        module: (route) => route.params.module,
      },
      children: [
        {
          path: '',
          name: 'crud-module-collection',
          component: resolve(__dirname, 'pages/collection'),
        },
        {
          path: 'create',
          name: 'crud-module-create',
          component: resolve(__dirname, 'pages/form'),
        },
        {
          path: ':id',
          name: 'crud-module-detail',
          component: resolve(__dirname, 'pages/detail'),
        },
        {
          path: ':id/update',
          name: 'crud-module-update',
          component: resolve(__dirname, 'pages/form'),
          props: {
            id: (route) => route.params.id,
          }
        },
      ],
    })
  })

  // Register components
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: join(__dirname, 'components'),
      prefix: 'c',
    })
  })
}

module.exports.meta = require('./package.json')
