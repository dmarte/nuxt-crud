import _ from 'lodash'
import CrudHead from '../libs/CrudHead'
import translator from './translator'
import messenger from './messenger'

export default {
  mixins: [translator, messenger],
  computed: {
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_INDEX () {
      return CrudHead.DISPLAY_MODE_INDEX
    },
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_FORM () {
      return CrudHead.DISPLAY_MODE_FORM
    },
    /**
     * @returns {string}
     * @constructor
     */
    DISPLAY_MODE_DETAIL () {
      return CrudHead.DISPLAY_MODE_DETAIL
    }
  },
  methods: {
    /**
     * Get the module page title.
     * @param {String} module
     * @returns {String}
     */
    getModulePageTitle (module) {
      const mode = this.getModuleDisplayMode().toLowerCase()
      let resource = this.getTranslationForResourcePlural(module)

      if (this.isModuleInIndexMode(module)) {
        return this.getTranslation(
          `crud.module.${module}.${mode}`,
          1,
          { resource },
          this.getTranslation(`crud.title.${mode}`, 1, { resource }, resource)
        )
      }

      if (
        this.isModuleInDetailMode(module) ||
        this.isModuleInFormMode(module)
      ) {
        resource = this.getTranslationForResourceSingular(module)
      }

      if (this.isModuleInDetailMode(module)) {
        return this.getTranslation(
          `crud.module.${module}.title.${mode}`,
          1,
          { resource },
          this.getTranslation(
            `crud.module.${module}.title.${mode}`,
            1,
            { resource },
            this.getTranslation(`crud.title.${mode}`, 1, { resource })
          )
        )
      }
      const key = this.isModuleInUpdateMode(module)
        ? 'crud.actions.update'
        : 'crud.actions.create'

      return this.getTranslation(key, 1, { resource })
    },
    /**
     * Is a byPass to get current Display mode.
     * YOU CAN REWRITE THIS METHOD.
     *
     * @returns {String}
     */
    getModuleDisplayMode () {
      // Check if there is any displayMode defined
      // in the current component
      if (!this.displayMode) {
        return this.DISPLAY_MODE_INDEX
      }
      return this.displayMode
    },
    /**
     * Translate the base label translations for a given field.
     *
     * @param {String} module
     * @param {CrudField.$options} field
     * @returns {CrudField.$options}
     */
    mapModuleFieldToTranslations (module, field) {
      field.label = this.getTranslationForFieldLabel(
        module,
        field.name,
        field.label
      )
      field.placeholder = this.getTranslationForFieldPlaceholder(
        module,
        field.placeholder
      )
      field.hint = this.getTranslationForFieldHint(module, field.hint)
      if (field.settings.valuePath) {
        field.settings.value = _.get(this, field.settings.valuePath, null)
      }
      return field
    },
    /**
     * Transform the current field head to to Vuetify table head.
     * YOU CAN REWRITE THIS METHOD.
     *
     * @param {{name: String}} head
     * @returns {{text, value}}
     */
    mapModuleFieldToTableHeader (head) {
      return {
        text: head.label,
        value: head.name,
        sortable: head.settings.sortable,
        field: head
      }
    },
    /**
     * Transform the current selected field to the list of allowed bindable
     * properties.
     *
     * @param {CrudHead.$options} field
     * @param {Object} resource
     * @returns {Object}
     */
    mapModuleFieldToForm (field, resource) {
      return field
    },
    /**
     * Transform the current selected field to the list of allowed bindable
     * properties.
     *
     * @param {CrudHead.$options} field
     * @param {Object} resource
     * @returns {Object}
     */
    mapModuleFieldToDetail (field, resource) {
      return field
    },
    /**
     * Build the schema based on fields defined.
     *
     * YOU CAN REWRITE THIS METHOD.
     *
     * @returns {{}}
     */
    getModuleResourceSchema (module, resource) {
      const out = {}
      this.getModuleFields(module).forEach((field) => {
        const defaultValue = _.get(field, 'settings.value', null)
        const resourceValue = _.get(resource, field.name, defaultValue)
        _.set(out, field.name, resourceValue)
      })
      return out
    },
    /**
     *
     * @param module
     * @param {String} fieldName
     * @returns {CrudHead.$options}
     */
    getModuleFieldByName (module, fieldName) {
      return this.getModuleFields(module).find(
        field => field.name === fieldName
      )
    },
    /**
     * Get the default value assigned to a given field.
     *
     * @param {Object} field
     * @returns {*}
     */
    getModuleFieldDefaultValue (field) {
      if (!field || !field.settings) {
        return null
      }
      if (field.settings.valueState) {
        return _.get(
          this.$store.state,
          field.settings.valueState,
          field.settings.value
        )
      }
      if (field.settings.valueGetter) {
        return _.get(
          this.$store.state,
          field.settings.valueGetter,
          field.settings.value
        )
      }
      return field.settings.value
    },
    /**
     * Get settings of a given module.
     *
     * @param {String} module
     * @returns {CrudModule.$options}
     */
    getModuleSettings (module) {
      return (
        this.$crud.modules.find(({ name }) => name === module) || {
          head: [],
          actions: []
        }
      )
    },
    getModuleActions (module) {
      return this.getModuleSettings(module).actions.map((action) => {
        const holder = {
          resource: this.getTranslationForResourceSingular(module)
        }
        action.label = this.getTranslation(
          action.label,
          1,
          holder,
          action.label
        )
        return action
      })
    },
    /**
     * Get the fields of a given module.
     *
     * @param {String} module
     * @param {Object} resource The schema of your resource.
     * @returns {Array}
     */
    getModuleFields (module, resource = {}) {
      return this.getModuleSettings(module).head.map(field =>
        this.mapModuleFieldToTranslations(module, field)
      )
    },
    /**
     * Get the fields that should be used in index pages.
     *
     * @param {String} module
     * @returns {Array}
     */
    getModuleFieldsUsedInIndex (module) {
      return this.getModuleFields(module, {})
        .filter(field => this.isModuleFieldVisibleOnCurrentMode(module, field))
        .map(this.mapModuleFieldToTableHeader)
    },
    getModuleFieldsUsedInDetail (module, resource) {
      return this.getModuleFields(module, resource)
        .filter(field =>
          this.isModuleFieldVisibleOnCurrentMode(module, field, resource)
        )
        .map(field => this.mapModuleFieldToDetail(field, resource))
    },
    /**
     * Get the fields that should be used in forms.
     *
     * @param module
     * @param resource
     * @returns {(Object|CrudHead.$options|*)[]}
     */
    getModuleFieldsUsedInForms (module, resource = {}) {
      return this.getModuleFields(module, resource)
        .filter(field =>
          this.isModuleFieldVisibleOnCurrentMode(module, field, resource)
        )
        .map(head => this.mapModuleFieldToForm(head, resource))
    },
    /**
     * Check if the current mode is in detail.
     *
     * @param {String} module
     * @returns {boolean}
     */
    isModuleInDetailMode (module) {
      if (!this.getModulePrimaryKeyValue(module)) {
        return false
      }
      return (
        this.$route.name === 'crud-module-detail' &&
        this.getModuleDisplayMode() === this.DISPLAY_MODE_DETAIL
      )
    },
    /**
     * Check if the current mode is Updating.
     *
     * @param {String} module
     * @returns {boolean}
     */
    isModuleInUpdateMode (module) {
      return (
        !!this.getModulePrimaryKeyValue(module) &&
        this.getModuleDisplayMode() === this.DISPLAY_MODE_FORM
      )
    },
    /**
     * Check if the current mode is creating.
     *
     * @param {String} module
     * @returns {boolean}
     */
    isModuleInCreateMode (module) {
      return (
        !this.isModuleInUpdateMode(module) &&
        this.getModuleDisplayMode() === this.DISPLAY_MODE_FORM
      )
    },

    /**
     * Check if the current mode is creating or updating.
     *
     * @param {String} module
     * @returns {boolean}
     */
    isModuleInFormMode (module) {
      return (
        this.isModuleInCreateMode(module) || this.isModuleInUpdateMode(module)
      )
    },

    /**
     * Check if the current display mode in in index.
     * @param {String} module
     * @returns {boolean}
     */
    isModuleInIndexMode (module) {
      return this.getModuleDisplayMode() === this.DISPLAY_MODE_INDEX
    },
    /**
     * Validate the visibility of a given field based on the value of another
     * field (if configured).
     *
     * @param {CrudHead.$options} field
     * @param {Object} schema
     * @returns {Boolean}
     */
    isModuleFieldVisibleWhenDependsOnOtherField (field, schema = {}) {
      if (!field.settings.visibility.when_field_name) {
        return true
      }
      const value = _.get(
        schema,
        field.settings.visibility.when_field_name,
        null
      )
      if (field.settings.visibility.when_field_value === null && value) {
        return true
      }

      return field.settings.visibility.when_field_value.includes(value)
    },
    /**
     * Verify the visibility of a given field.
     *
     * @param {String} module
     * @param {CrudHead.$options} field
     * @param {Object} resource
     * @returns {boolean}
     */
    isModuleFieldVisibleOnCurrentMode (module, field, resource = {}) {
      let visible = false
      switch (this.getModuleDisplayMode()) {
        case this.DISPLAY_MODE_FORM:
          visible =
            (this.isModuleInUpdateMode(module) &&
              field.settings.visibility.updating) ||
            (this.isModuleInCreateMode(module) &&
              field.settings.visibility.creating)
          break
        case this.DISPLAY_MODE_INDEX:
          visible = field.settings.visibility.index
          break
        case this.DISPLAY_MODE_DETAIL:
          visible = field.settings.visibility.detail
          break
      }

      return visible
        ? this.isModuleFieldVisibleWhenDependsOnOtherField(field, resource)
        : false
    },
    /**
     * Get the name of the primary key used.
     * @params {String} module
     * @returns {string}
     */
    getModulePrimaryKeyName (module) {
      return (
        this.$crud.modules.find(({ name }) => name === module).primaryKey ||
        'id'
      )
    },
    /**
     * This method allow you to get the name of the key used as parameter in
     * the route.
     * @returns {String}
     */
    getModulePrimaryKeyParamName (module) {
      if (this.$route.params[module]) {
        return this.$route.params[module]
      }
      return this.getModulePrimaryKeyName(module)
    },
    /**
     * Get the primary key used in the route param.
     *
     * @param {String} module
     * @returns {String}
     */
    getModulePrimaryKeyFromRoute (module) {
      return (
        this.$route.params[this.getModulePrimaryKeyParamName(module)] || ''
      )
    },
    /**
     * Get the vue-router route for detail page.
     * @param {String} module
     * @returns {{query: {redirect: string}, name: string, params: {module:
     *   default.methods.module, id: String}}}
     */
    getModuleRouteDetail (module) {
      return {
        name: 'crud-module-detail',
        params: {
          module: this.module,
          id: this.getModulePrimaryKeyValue(module)
        }
      }
    },
    /**
     * Get the value of the primary key for the given module
     * from the MODEL, SCHEMA or ROUTE
     * @param {String} module
     * @returns {String}
     */
    getModulePrimaryKeyValue (module) {
      // Used in form /detail views
      const modulePrimaryKeyName = this.getModulePrimaryKeyName(module)
      if (this.value && this.value[modulePrimaryKeyName]) {
        return this.value[modulePrimaryKeyName]
      }
      // Used in form / detail views
      if (this.model && this.model[modulePrimaryKeyName]) {
        return this.model[modulePrimaryKeyName]
      }

      return this.getModulePrimaryKeyFromRoute()
    },
    /**
     * Generate the URL to interact with the URL for a given module.
     * @param {String} module
     * @returns {string}
     */
    getModuleApiUrl (module) {
      return `${this.$crud.api.prefix}${module}`
    },
    /**
     * Generate the URL to create new resources.
     * @param {String} module
     * @returns {string}
     */
    getModuleApiUrlCreate (module) {
      return this.getModuleApiUrl(module)
    },
    /**
     * Generate the URL to update the current selected module.
     * @param {String} module
     * @returns {String}
     */
    getModuleApiUrlUpdate (module) {
      return [
        this.getModuleApiUrlCreate(module),
        this.getModulePrimaryKeyValue(module)
      ].join('/')
    },
    /**
     * Generate the API URL to destroy a given resource.
     * @param {String} module
     * @returns {String}
     */
    getModuleApiUrlDestroy (module) {
      return this.getModuleApiUrlUpdate(module)
    },
    /**
     * Generate the API URL to get the detail of a given resource.
     * @param {String} module
     * @returns {String}
     */
    getModuleApiUrlShow (module) {
      return this.getModuleApiUrlUpdate(module)
    },
    /**
     * Trigger when the element is saved.
     * @param {Object} item
     * @returns {void}
     */
    saved (item) {
      this.$emit('save:success', item)
    },
    /**
     * Responsible to notify when
     * an item of the list is destroyed.
     *
     * @param {Object} item
     * @returns {void}
     */
    destroyed (item) {
      this.success(this.getTranslationForSuccessDestroy(this.module))
      this.$emit('destroy:success', item)
    },
    /**
     * Responsible to notify when updated resource.
     * @param {Object} item
     * @returns {void}
     */
    updated (item) {
      this.success(this.getTranslationForSuccessUpdate(this.module))
      this.$emit('input', item)
      this.$emit('update:success', item)
    },
    /**
     * Responsible to notify when created resource.
     * @param {Object} item
     * @returns {void}
     */
    created (item) {
      this.success(this.getTranslationForSuccessCreate(this.module))
      this.$emit('input', item)
      this.$emit('create:success', item)
    },
    /**
     * Responsible to notify when failed any operation.
     * @param {CrudResponse} response
     */
    failed (response) {
      this.error(
        this.getTranslation(response.message, 1, {
          resource: this.getTranslationForResourceSingular(this.module)
        })
      )
      if (!response.isSessionExpired) {
        this.$emit('failed', response)
        return
      }
      if (this.$auth && this.$auth.logout) {
        this.$auth.logout()
      }
      const route = this.getModuleSettings(this.module).routes.login
      if (route) {
        this.$router.push({
          name: route,
          query: { redirect: this.$route.fullPath }
        })
      }

      this.$emit('failed', response)
    },
    /**
     * Responsible to notify when cancelled operation occurs.
     * @param {CrudResponse} response
     * @returns {void}
     */
    cancelled (response) {
      if (response && response.reset) {
        response.reset()
      }
      this.$emit('cancel')
    },
    /**
     * Responsible to notify when a given resource was found.
     * @param {CrudResponse} response
     */
    found (response) {
      if (response && response.reset) {
        response.reset()
      }
      this.$emit('found', response)
    }
  }
}
