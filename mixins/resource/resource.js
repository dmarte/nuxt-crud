import { get, isObject, isFunction, set } from 'lodash'
import translator from '../translator'
import CrudResponse from '../../libs/CrudResponse'
import messenger from '../../mixins/messenger'

export default {
  mixins: [translator, messenger],
  props: {
    mode: {
      type: String,
      required: true
    },
    resourceId: {
      type: [String, Number],
      default () {
        return this.$route.params.resourceId
      }
    },
    resource: {
      type: String,
      default () {
        return this.$route.params.resource
      }
    }
  },
  data () {
    const settings = this.getResourceSettings(this.resource)
    const fields = this.getResourceFields(this.mode, settings)
    const filterable = this.getResourceFields('filter', settings)
    return {
      response: new CrudResponse(),
      model: this.buildResourceModel(fields),
      fields,
      filterable,
      settings
    }
  },
  computed: {
    isUpdating () {
      return this.mode === 'update' && this.resourceId
    },
    isCreating () {
      return this.mode === 'create'
    },
    isDetail () {
      return this.mode === 'detail' && this.resourceId
    },
    shouldFetchResource () {
      return this.isUpdating || this.isDetail
    }
  },
  methods: {
    getCurrentDate () {
      return this.$moment().format('YYYY-MM-DD')
    },
    /**
     * Get the name of the primary key used.
     * @params {String} module
     * @returns {string}
     */
    getPrimaryKeyName () {
      return (
        this.settings.primaryKey || 'id'
      )
    },
    /**
     * Get the primary key used in the route param.
     * @returns {String}
     */
    getPrimaryKeyFromRoute () {
      return this.$route.params[this.getPrimaryKeyName()]
    },
    /**
     * Get the value of the primary key for the given module
     * from the MODEL, SCHEMA or ROUTE
     * @returns {String}
     */
    getPrimaryKeyValue () {
      // Used in form /detail views
      const modulePrimaryKeyName = this.getPrimaryKeyName()
      if (this.value && this.value[modulePrimaryKeyName]) {
        return this.value[modulePrimaryKeyName]
      }
      // Used in form / detail views
      if (this.model && this.model[modulePrimaryKeyName]) {
        return this.model[modulePrimaryKeyName]
      }

      return this.getPrimaryKeyFromRoute() || this.resourceId
    },
    /**
     * Build the resource model.
     *
     * @param {Array} fields
     * @param {any} resourceData
     * @returns {{}}
     */
    buildResourceModel (fields, resourceData) {
      const out = {}
      fields
        .filter(({ is }) => !['CFieldHeading'].includes(is))
        .forEach((field) => {
          const value = typeof field.value === 'undefined' ? field.defaultValue : field.value
          set(out,
            field.name,
            get(resourceData, field.name, value)
          )
        })
      return out
    },
    /**
     * Set a value on the model path.
     *
     * @param {string} path
     * @param {any} value
     * @returns {default.methods}
     */
    setModelValue (path, value) {
      set(this.model, path, value)
      return this
    },
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
    getResourceUrl ({
      resource,
      resourceId = null,
      parentResource = null,
      parentResourceId = null,
      prefix = null
    }) {
      return [prefix, parentResource, parentResourceId, resource, resourceId]
        .filter(v => v)
        .join('/')
        .replace(/([/]){2}/gi, '/')
        .replace(/\/$/, '')
    },
    /**
     * Get the registered resource settings.
     *
     * @param {String} resourceName
     * @returns {{primaryKey: <String>, parent: <String|undefined> name:
     *   <String>, keyPerPage: <String>, keyCurrentPage: <String>, keySortBy:
     *   <String>, keySortByDesc:<String>}}
     */
    getResourceSettings (resourceName) {
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
    getResourceFields (mode, resourceSettings) {
      return resourceSettings.head
        .filter(({ settings: { visibility } }) => visibility[mode])
        .map((field) => {
          const out = {}
          out.sortable = field.settings.sortable
          out.filter = field.settings.filter
          out.visibility = field.settings.visibility
          out.params = field.settings.params
          out.name = field.name
          out.label =
          this.getTranslationForFieldLabel(
            resourceSettings.name,
            field.name,
            field.label
          ) || undefined
          out.placeholder =
          this.getTranslationForFieldPlaceholder(
            resourceSettings.name,
            field.name
          ) || undefined
          out.hint =
          this.getTranslationForFieldHint(
            resourceSettings.name,
            field.name
          ) || undefined

          if (field.settings.valuePath) {
            const callback = get(
              this,
              field.settings.valuePath,
              field.settings.value
            )

            out.defaultValue = isFunction(callback) ? callback(field) : callback
          } else {
            out.defaultValue = field.settings.value
          }

          out.is = field.component

          if (out.is === 'CFieldHeading') {
            out.label = this.getTranslation(out.label)
          }

          if (field.settings.items.length > 0) {
            out.items = field.settings.items.map((option) => {
              if (typeof option === 'string') {
                return {
                  value: option,
                  text: this.getTranslation(option, 1, {}, option)
                }
              }
              if (option.text) {
                option.text = this.getTranslation(
                  option.text,
                  1,
                  {},
                  option.text
                )
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
    hasResourceParent (resourceSettings) {
      return !!resourceSettings.parent
    },
    /**
     * Get the primary key name
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceKeyName (resourceSettings) {
      return resourceSettings.primaryKey || 'id'
    },
    /**
     * Get the resource key value.
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceKeyValue (resourceSettings) {
      return this.resourceId
    },
    /**
     * Get the parent resource.
     *
     * @param {any} resourceSettings
     * @returns {String}
     */
    getResourceParent (resourceSettings) {
      return this.parentResource || resourceSettings.parent
    },
    /**
     * Get the resource parent primary key value.
     *
     * @param {any} resourceSettings
     * @returns {null|*}
     */
    getResourceParentKeyValue (resourceSettings) {
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
    getResourceActionsStandalone (resourceSettings) {
      return resourceSettings.actions
        .filter(({ standalone }) => standalone)
        .filter(({ visibility }) => visibility[this.mode])
        .map(action => this.mapResourceAction(action, resourceSettings))
    },
    getResourceActionsInline (resourceSettings) {
      return resourceSettings.actions
        .filter(({ inline }) => inline)
        .filter(({ visibility }) => visibility[this.mode])
        .map(action => this.mapResourceAction(action, resourceSettings))
    },
    gerResourceActionsDropdown (resourceSettings) {
      return resourceSettings.actions
        .filter(({ inline, standalone }) => !inline && !standalone)
        .filter(({ visibility }) => visibility[this.mode])
        .map(action => this.mapResourceAction(action, resourceSettings))
    },
    /**
     * Get the number of per pages to display.
     *
     * @param {any} resourceSettings
     * @returns {Number}
     */
    getPerPage (resourceSettings) {
      if (this.$route.query.perPage) {
        return parseInt(this.$route.query.perPage) || resourceSettings.perPage[0]
      }
      return resourceSettings.perPage[0]
    },
    /**
     * Get the default column to sort the results.
     *
     * @param {any} resourceSettings
     * @returns {String}
     */
    getSortBy (resourceSettings) {
      if (this.$route.query.sortBy) {
        return this.$route.query.sortBy
      }
      const field = resourceSettings.head.filter(({ settings: { visibility } }) => visibility[this.mode]).shift()
      if (field) {
        return field.name
      }
      return resourceSettings.primaryKey
    },
    /**
     * Get the boolean to check if must sort in descending order.
     *
     * @param {any} resourceSettings
     * @returns {boolean}
     */
    getSortByDesc (resourceSettings) {
      if (typeof this.$route.query.sortDesc === 'string') {
        return this.$route.query.sortDesc === 'true'
      }
      if (typeof this.$route.query.sortDesc === 'boolean') {
        return this.$route.query.sortDesc
      }
      return true
    },
    /**
     * Get the current page to show in results.
     * @param {any} resourceSettings
     * @returns {Number}
     */
    getCurrentPage (resourceSettings) {
      return this.$route.query.currentPage || 1
    },

    /**
     * Get the module page title.
     * @param {String} resourceName
     * @param {String} mode
     * @returns {String}
     */
    getResourcePageTitle (resourceName, mode = 'index') {
      let resource = this.getTranslationForResourcePlural(resourceName)

      if (mode === 'index') {
        return this.getTranslation(
          `crud.module.${resourceName}.${mode}`,
          1,
          { resource },
          this.getTranslation(`crud.title.${mode}`, 1, { resource }, resource)
        )
      }

      if (this.isDetail || this.isUpdating || this.isCreating) {
        resource = this.getTranslationForResourceSingular(resourceName)
      }

      return this.getTranslation(
          `crud.module.${resourceName}.title.${mode}`,
          1,
          { resource },
          this.getTranslation(`crud.title.${mode}`, 1, { resource })
      )
    },

    /**
     * Parse a given resource action and set the route format.
     *
     * @param {CrudAction.$options} action
     * @param {{}} params
     * @param {{}} query
     * @returns {undefined|*}
     */
    parseResourceActionRoute (action, params = {}, query = {}) {
      if (!action || !action.route || !isObject(action.route)) {
        return undefined
      }

      const route = {
        name: action.route.name,
        params: {},
        query: {}
      }

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
    parseResourceActionParams (action, resourceKeyValue, resourceKeyName) {
      if (!action || !action.params) {
        return {}
      }
      const out = {}
      for (const path in action.params) {
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
    parseResourceActionQuery (action, resourceKeyValue, resourceKeyName) {
      if (!action || !action.query) {
        return {}
      }
      const out = {}
      for (const path in action.query) {
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
    mapResourceAction (action, resourceSettings) {
      const out = {}
      const holder = {
        resource: this.getTranslationForResourceSingular(resourceSettings.name)
      }
      const resourceKey = this.getResourceKeyName(resourceSettings)
      const resourceKeyValue = this.getResourceKeyValue(resourceSettings)

      out.standalone = action.standalone
      out.inline = action.inline
      out.visibility = action.visibility
      out.name = action.name
      out.params = this.parseResourceActionParams(
        action,
        resourceKey,
        resourceKeyValue
      )
      out.query = this.parseResourceActionQuery(
        action,
        resourceKey,
        resourceKeyValue
      )
      out.route = this.parseResourceActionRoute(action, out.params, out.query)
      out.icon = action.icon
      out.emits = action.emits
      out.vuex = action.vuex
      out.confirmation = action.confirmation

      if (action.confirmation.enabled) {
        out.confirmation.textBody = this.getTranslation(
          out.confirmation.textBody,
          1,
          holder,
          undefined
        )
        out.confirmation.textSubmit = this.getTranslation(
          out.confirmation.textSubmit,
          1,
          holder,
          undefined
        )
        out.confirmation.textCancel = this.getTranslation(
          out.confirmation.textCancel,
          1,
          holder,
          undefined
        )
        out.confirmation.textTitle = this.getTranslation(
          out.confirmation.textTitle,
          1,
          holder,
          undefined
        )
      }

      out.label = this.getTranslation(action.label, 1, holder, action.label)
      return out
    },
    /**
     * Get the headers that should be used within the collection table.
     *
     * @param {any} resourceSettings
     * @returns {Array<{text: string, value: string, separator: boolean}>}
     */
    getResourceHeaders (resourceSettings) {
      return [
        ...this.getResourceFields(this.mode, resourceSettings).map(field => ({
          text: field.label,
          value: field.name,
          field,
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
    mapAfterFetch (item) {
      return item
    },
    async find ({
      resource,
      resourceId = null,
      parentResource = null,
      parentResourceId = null,
      prefix = 'api'
    }) {
      const url = this.getResourceUrl({
        resource,
        resourceId,
        parentResource,
        parentResourceId,
        prefix
      })
      const response = await this.$axios.$get(url)
      this.model = this.buildResourceModel(this.fields, get(response, this.settings.resourceWrapper, response))
      this.fields = this.fields.map((field) => {
        field.value = get(response, field.name, field.defaultValue)
        return field
      })
    },
    async paginate ({
      resource,
      resourceId = null,
      parentResource = null,
      parentResourceId = null,
      search = undefined,
      currentPage = 1,
      perPage = 15,
      sortBy = 'id',
      sortDesc = true,
      query = {},
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
          sort_desc: sortDesc,
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
          sortBy,
          sortDesc,
          currentPage: parseInt(currentPage),
          perPage,
          search,
          lastPage: get(result, 'meta.last_page', 1) || 1,
          from: parseInt(get(result, 'meta.from', 0)) || 0,
          to: get(result, 'meta.to', 0) || 0,
          total: get(result, 'meta.total', 0) || 0,
          query
        }
      }
    },
    whenDestroyed (item) {
      if (this.mode === 'index') {
        this.$fetch()
      }
      if (this.mode === 'detail') {
        this.$router.push(
          this.getResourceUrl({
            resource: this.resource,
            parentResource: this.parentResource,
            parentResourceId: this.parentResourceId,
            prefix: '/c/'
          })
        )
      }
    },
    async whenDestroy ({ value, action }) {
      action.confirmation.loading = true
      try {
        await this.$axios.$delete(
          this.getResourceUrl({
            resource: this.resource,
            resourceId: get(value, this.getPrimaryKeyName(), this.resourceId),
            parentResource: this.parentResource,
            parentResourceId: this.parentResourceId,
            prefix: this.$crud.api.prefix
          })
        )
        this.success(this.getTranslationForSuccessDestroy(this.resource))
        this.whenDestroyed(value)
      } catch (exception) {
        this.response.parse(exception)
        this.error(this.response.message)
      } finally {
        action.confirmation.loading = false
      }
    }
  }
}
