import { get, has, isObject, set } from 'lodash'
import translator from '../translator'

export default {
  mixins: [translator],
  props: {
    mode: {
      type: String,
      required: true
    },
    resourceId: {
      type: String,
      default() {
        return this.$route.params.resource_id
      }
    },
    resource: {
      type: String,
      default() {
        return this.$route.params.resource
      }
    }
  },
  computed: {
    settings() {
      return this.getResourceSettings(this.resource)
    }
  },
  methods: {
    /**
     * Get the resource build URL.
     *
     * @param {String} resource
     * @param {String} resourceId
     * @param {String} parentResource
     * @param {String} parentResourceId
     * @param {String} prefix
     * @returns {String}
     */
    getResourceUrl({
                     resource,
                     resourceId = null,
                     parentResource = null,
                     parentResourceId = null,
                     prefix = null
                   }) {
      return [prefix, parentResource, parentResourceId, resource, resourceId]
        .filter((v) => v)
        .join('/')
        .replace(/([\/{2}]+)/gi, '/')
    },
    /**
     * Get the registered resource settings.
     *
     * @param {String} resourceName
     * @returns {{primaryKey: <String>, parent: <String|undefined> name: <String>, keyPerPage: <String>, keyCurrentPage: <String>, keySortBy: <String>, keySortByDesc:<String>}}
     */
    getResourceSettings(resourceName) {
      return Object.assign(
        {
          primaryKey: 'id',
          name: resourceName,
          parent: undefined,
          keyCurrentPage: 'page',
          keyPerPage: 'per_page',
          keySortBy: 'sort_by',
          keySortByDesc: 'sort_desc',
          head: [],
          actions: []
        },
        this.$crud.modules.find(({ name }) => name === resourceName)
      )
    },
    /**
     * Get the fields for a given resource populated.
     *
     * @param {string} mode
     * @param {any} resourceSettings
     * @returns {Array<{name, label, placeholder, hint, value, is, items}>}
     */
    getResourceFields(mode, resourceSettings) {
      return resourceSettings.head
        .filter(({settings: { visibility }}) => visibility[mode])
        .map((field) => {
          const out = {}
          out.name = field.name
          out.label = this.getTranslationForFieldLabel(resourceSettings.name, field.name, field.label) || undefined
          out.placeholder = this.getTranslationForFieldPlaceholder(resourceSettings.name, field.name) || undefined
          out.hint = this.getTranslationForFieldHint(resourceSettings.name, field.name) || undefined

          if (field.settings.valuePath) {
            out.value = get(this, field.settings.valuePath, field.settings.value)
          }

          out.is = field.component
          if (field.settings.items.length > 0) {
            out.items = field.settings.items.map((option) => {
              if (typeof option === 'string') {
                return {
                  value: option,
                  text: this.getTranslation(option, 1, {}, option)
                }
              }
              if (option.text) {
                option.text = this.getTranslation(option.text, 1, {}, option.text)
              }
              return option
            })
          }
          return out
        })
    },
    /**
     * Check if a given resource has a parent resource.
     *
     * @param {any} resourceSettings
     * @returns {boolean}
     */
    hasResourceParent(resourceSettings) {
      return !!resourceSettings.parent
    },
    /**
     * Get the primary key name
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceKeyName(resourceSettings) {
      return resourceSettings.primaryKey || 'id'
    },
    /**
     * Get the resource key value.
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceKeyValue(resourceSettings) {
      return this.resourceId
    },
    /**
     * Get the parent resource.
     *
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceParent(resourceSettings) {
      return this.parentResource || resourceSettings.parent
    },
    /**
     * Get the resource parent primary key value.
     *
     * @param {any} resourceSettings
     * @returns {null|*}
     */
    getResourceParentKeyValue(resourceSettings) {
      if (!resourceSettings.parent) {
        return null
      }
      return this.parentResourceId
    },
    /**
     * Get the list of actions for standalone only.
     *
     * @param {any} resourceSettings
     * @returns {Array}
     */
    getResourceActionsStandalone(resourceSettings) {
      return resourceSettings.actions.filter(({ standalone }) => standalone).map(action => this.mapResourceAction(action, resourceSettings))
    },
    /**
     * Get the number of per pages to display.
     *
     * @param {any} resourceSettings
     * @returns {Number}
     */
    getPerPage(resourceSettings) {
      const key = resourceSettings.keyPerPage
      if (this.$route.query[key]) {
        return parseInt(this.$route.query[key])
      }
      return resourceSettings.perPage[0]
    },
    /**
     * Get the default column to sort the results.
     *
     * @param {any} resourceSettings
     * @returns {String}
     */
    getSortBy(resourceSettings) {
      const key = resourceSettings.keySortBy
      if (this.$route.query[key]) {
        return parseInt(this.$route.query[key])
      }
      return resourceSettings.primaryKey
    },
    /**
     * Get the boolean to check if must sort in descending order.
     *
     * @param {any} resourceSettings
     * @returns {boolean}
     */
    getSortByDesc(resourceSettings) {
      const key = resourceSettings.keySortByDesc
      if (this.$route.query[key]) {
        return this.$route.query[key] === 'true'
      }
      return false
    },
    /**
     * Get the current page to show in results.
     * @param {any} resourceSettings
     * @returns {Number}
     */
    getCurrentPage(resourceSettings) {
      const key = resourceSettings.keyCurrentPage
      if (this.$route.query[key]) {
        return parseInt(this.$route.query[key])
      }
      return 1
    },

    /**
     * Parse a given resource action and set the route format.
     *
     * @param {CrudAction.$options} action
     * @param {{}} params
     * @param {{}} query
     * @returns {undefined|*}
     */
    parseResourceActionRoute(action, params = {}, query = {}) {
      if (!action || !action.route || !isObject(action.route)) {
        return undefined
      }

      const route = { name: action.route.name, params:{}, query: {} }

      route.params = { ...params }
      route.query = { ...query }

      return route
    },
    /**
     * Parse the parameters set for a given action.
     *
     * @param {CrudAction.$options} action
     * @param {any} resourceKeyValue
     * @param {string} resourceKeyName
     * @returns {{}}
     */
    parseResourceActionParams(action, resourceKeyValue, resourceKeyName) {
      if (!action || !action.params) {
        return {}
      }
      const out = {}
      for (const path in action.params) {
        if (!action.params.hasOwnProperty(path)) {
          continue
        }

        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[resourceKeyName] = resourceKeyValue
          continue
        }

        const name = action.params[path]
        set(out, name, get(this, path, undefined))
      }
      return out
    },
    /**
     * Parse the resource action query.
     *
     * @param {CrudAction.$options} action
     * @param {any} resourceKeyValue
     * @param {string} resourceKeyName
     * @returns {{}}
     */
    parseResourceActionQuery(action, resourceKeyValue, resourceKeyName) {
      if (!action || !action.query) {
        return {}
      }
      const out = {}
      for (const path in action.query) {
        if (!action.query.hasOwnProperty(path)) {
          continue
        }

        // Wants to add the primary key
        if (path === 'primaryKey') {
          out[resourceKeyName] = resourceKeyValue
          continue
        }

        const name = action.query[path]
        set(out, name, get(this, path, undefined))
      }
      return out
    },
    /**
     * Map an action to the final output result.
     *
     * @param {CrudAction.$options} action
     * @param {any} resourceSettings
     * @returns {{}}
     */
    mapResourceAction(action, resourceSettings) {
      const out = {}
      const holder = {
        resource: this.getTranslationForResourceSingular(resourceSettings.name)
      }
      const resourceKey = this.getResourceKeyName(resourceSettings)
      const resourceKeyValue = this.getResourceKeyValue(resourceSettings)

      out.params = this.parseResourceActionParams(action, resourceKey, resourceKeyValue)
      out.query = this.parseResourceActionQuery(action, resourceKey, resourceKeyValue)
      out.route = this.parseResourceActionRoute(action, out.params, out.query)
      out.icon = action.icon
      out.emits = action.emits
      out.vuex = action.vuex

      if (action.confirmation.enabled) {
        out.confirmation.textBody = this.getTranslation(out.confirmation.textBody, 1, holder, undefined)
        out.confirmation.textSubmit = this.getTranslation(out.confirmation.textSubmit, 1, holder, undefined)
        out.confirmation.textCancel = this.getTranslation(out.confirmation.textCancel, 1, holder, undefined)
        out.confirmation.textTitle = this.getTranslation(out.confirmation.textTitle, 1, holder, undefined)
      }

      out.label = this.getTranslation(
        action.label,
        1,
        holder,
        action.label
      )
      return out
    },
    /**
     * Dispatch events around a given action.
     *
     * @param {CrudAction.$options} action
     * @returns {Promise<void>}
     */
    async dispatchResourceAction(action) {
      if (!action) {
        return
      }

      if (action.vuex.action) {
        await this.$store.dispatch(action.vuex.action)
      }

      if (action.emits) {
        this.$emit(action.emits, action.params)
      }
    },
    /**
     * Get the headers that should be used within the collection table.
     *
     * @param {any} resourceSettings
     * @returns {Array<{text: string, value: string, separator: boolean}>}
     */
    getResourceHeaders(resourceSettings) {
      return [
        ...resourceSettings.head.map(({ name, label }) => ({
          text: this.getTranslationForFieldLabel(resourceSettings.name, name, label),
          value: name,
          separator: true
        })),
        {
          text: '',
          value: '_',
          separator: false
        }
      ]
    },
    /**
     * Map the model after fetch.
     *
     * @param {{any}}item
     * @returns {*}
     */
    mapAfterFetch(item) {
      return item
    },
    async paginate({
                     resource,
                     resourceId = null,
                     parentResource = null,
                     parentResourceId = null,
                     search = undefined,
                     currentPage = 1,
                     query = {},
                     perPage = 30,
                     sortBy = 'id',
                     sortByDesc = true,
                     prefix = 'api'
                   }) {
      const url = this.getResourceUrl({
        resource,
        resourceId,
        parentResource,
        parentResourceId,
        prefix
      })
      const result = await this.$axios.$get(url, {
        params: {
          ...query,
          sort_by: sortBy,
          sort_desc: sortByDesc,
          page: currentPage,
          per_page: perPage,
          paginator: true,
          search,
          resource,
          resourceId,
          parentResource,
          parentResourceId
        }
      })
      return {
        collection: result.data.map(this.mapAfterFetch),
        meta: {
          perPage: parseInt(get(result, 'meta.per_page', perPage)) || perPage,
          from: parseInt(get(result, 'meta.from', 0)) || 0,
          to: get(result, 'meta.to', 0) || 0,
          total: get(result, 'meta.total', 0) || 0,
          query
        }
      }
    }
  }
}
