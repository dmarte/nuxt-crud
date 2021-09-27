import { resolve, join } from 'path'
import messenger from './store/messenger'
import breadcrumbs from './store/breadcrumbs'

export default function (options) {
  const settings = Object.assign(
    {
      api: {
        prefix: '/api/'
      },
      modules: []
    },
    this.options.crud || {},
    options
  )
  // Register the base plugin
  this.addPlugin({
    src: resolve(__dirname, 'plugin.js'),
    options: {
      modules: settings.modules.map(module => module.toObject()),
      api: settings.api,
      store: {
        messenger,
        breadcrumbs
      }
    }
  })
  this.extendRoutes((routes, resolve) => {
    routes.push({
      path: '/c/:resource',
      name: 'crud-resource-index',
      component: resolve(__dirname, 'pages/resource/index'),
      props: {
        mode: 'index',
        resource: route => route.params.resource,
        resourceId: null
      }
    })

    routes.push({
      path: '/c/:resource/create',
      name: 'crud-resource-create',
      component: resolve(__dirname, 'pages/resource/form'),
      props: {
        mode: 'create',
        resource: route => route.params.resource,
        resourceId: null
      }
    })

    routes.push({
      path: '/c/:resource/:resourceId',
      name: 'crud-resource-detail',
      component: resolve(__dirname, 'pages/resource/detail'),
      props: {
        mode: 'detail',
        resource: route => route.params.resource,
        resourceId: route => route.params.resourceId
      }
    })

    routes.push({
      path: '/c/:resource/:resourceId/update',
      name: 'crud-resource-update',
      component: resolve(__dirname, 'pages/resource/form'),
      props: {
        mode: 'update',
        resource: route => route.params.resource,
        resourceId: route => route.params.resourceId
      }
    })
  })

  // Register components
  this.nuxt.hook('components:dirs', (dirs) => {
    dirs.push({
      path: join(__dirname, 'components/fields')
    })
    dirs.push({
      path: join(__dirname, 'components/ui')
    })
  })
}

module.exports.meta = require('./package.json')
