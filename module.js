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

    // routes.push({
    //   path: '/c/:parent/:parent_id/:resource',
    //   name: 'crud-resource-child-index',
    //   component: resolve(__dirname, 'pages/child/index'),
    //   props: {
    //     mode: 'index',
    //   }
    // })
    //
    // routes.push({
    //   path: '/c/:parent/:parent_id/:resource/create',
    //   name: 'crud-resource-child-create',
    //   component: resolve(__dirname, 'pages/child/form'),
    //   props: {
    //     mode: 'create',
    //   }
    // })
    //
    // routes.push({
    //   path: '/c/:parent/:parent_id/:resource/:resource_id',
    //   name: 'crud-resource-child-detail',
    //   component: resolve(__dirname, 'pages/child/detail'),
    //   props: {
    //     mode: 'detail',
    //     parentResource: route => route.params.parent,
    //     parentResourceId: route => route.params.parent_id,
    //     resource: route => route.params.resource,
    //     resourceId: route => route.params.resource_id
    //   }
    // })
    //
    // routes.push({
    //   path: '/c/:parent/:parent_id/:resource/:resource_id/update',
    //   name: 'crud-resource-child-update',
    //   component: resolve(__dirname, 'pages/child/form'),
    //   props: {
    //     mode: 'update'
    //   }
    // })

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
