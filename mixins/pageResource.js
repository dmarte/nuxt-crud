import _ from 'lodash'
import CrudResponse from '../libs/CrudResponse'
import module from './module'
import messenger from './messenger'

export default {
  mixins: [module, messenger],
  props: {
    module: {
      type: String,
      required: true
    },
    value: {
      type: [Object, String, Array, Number],
      default: () => ({})
    }
  },
  data () {
    return {
      response: new CrudResponse(),
      processing: false,
      model: {}
    }
  },
  created () {
    this.reset()
  },
  methods: {
    /**
     * Transform the current selected field to the list of allowed bindable properties.
     *
     * @override {module.methods.mapModuleFieldToForm}
     * @param {CrudHead.$options} field
     * @param {Object} resource
     * @returns {Object}
     */
    mapModuleFieldToForm (field, resource) {
      field.settings.value = this.getModelPath(
        field.name,
        this.getModuleFieldDefaultValue(field)
      )
      return field
    },
    /**
     * Get a value from model or form value path.
     * @param {String} path
     * @param {String|Array|Object|Number|undefined} defaults
     * @returns {Exclude<{}[never], undefined>}
     */
    getModelPath (path, defaults = null) {
      return _.get(this.model, path, _.get(this.value, path, defaults))
    },
    /**
     * Set a value into the current model.
     * @param {String} path
     * @param {String|Array|Object|Number|undefined} value
     * @returns {default.methods}
     */
    setModelPath (path, value) {
      _.set(this.model, path, value)
      return this
    },
    /**
     * @returns {String|Number}
     */
    getPrimaryKey () {
      return this.getModulePrimaryKeyValue(this.module)
    },
    /**
     * Try to fetch de detail of a given resource.
     * @returns {Promise<any>}
     */
    async show () {
      return await this.$axios.$get(this.getModuleApiUrlShow(this.module))
    },
    /**
     * Try to create a new resource in the database.
     * @returns {Promise<any>}
     */
    async store () {
      const hooks = this.getModuleSettings(this.module).hooks
      if (hooks.beforeCreate) {
        await this.$store.dispatch(hooks.beforeCreate, this.model)
      }
      return await this.$axios.$post(
        this.getModuleApiUrlCreate(this.module),
        this.model
      )
    },
    /**
     * Try to update the given resource in the API.
     * @returns {Promise<any>}
     */
    async update () {
      const hooks = this.getModuleSettings(this.module).hooks
      if (hooks.beforeUpdate) {
        await this.$store.dispatch(hooks.beforeUpdate, this.model)
      }
      return await this.$axios.$put(
        this.getModuleApiUrlUpdate(this.module),
        this.model
      )
    },
    /**
     * Try to destroy a given resource in the database.
     * @returns {Promise<any>}
     */
    async destroy () {
      return await this.$axios.$delete(this.getModuleApiUrlDestroy(this.module))
    },
    /**
     * Hook to trigger when a given resource is destroyed.
     * @returns {Promise<void>}
     */
    async whenDestroy () {
      this.response.reset()
      this.processing = true
      try {
        await this.destroy()
        this.destroyed(this.model)
        this.reset()
      } catch (exception) {
        this.response.parse(exception)
        this.failed(this.response)
      } finally {
        this.processing = false
      }
    },
    /**
     * Hook to trigger the create / update method when needed.
     * @returns {Promise<void>}
     */
    async whenSave () {
      this.response.reset()
      this.processing = true
      try {
        if (this.isModuleInUpdateMode(this.module)) {
          const response = await this.update()
          this.saved(response)
          this.updated(response)
        } else {
          const response = await this.store()
          this.saved(response)
          this.created(response)
        }
        setTimeout(this.reset)
        this.redirectIfNeeded()
      } catch (exception) {
        this.response.parse(exception)
        this.failed(this.response)
      } finally {
        this.processing = false
      }
    },
    /**
     * When something wrong within the module.
     * @param {CrudResponse} response
     * @returns {void}
     */
    whenFailed (response) {
      this.failed(response)
    },
    /**
     * When an action (any) is cancelled.
     * USEFUL TO BYPASS THE ACTION.
     *
     * @param {CrudResponse} response
     * @returns {void}
     */
    whenCancelled (response) {
      this.reset()
      this.cancelled(response)
      this.redirectIfNeeded()
    },
    /**
     * Trigger when the given resource is finded.
     * USEFUL TO BYPASS THE ACTION.
     *
     * @param {any} response
     */
    whenFound (response) {
      return this.found(response)
    },
    redirectIfNeeded () {
      if (this.$route.query.redirect) {
        this.$router.push(this.$route.query.redirect)
      } else {
        this.$router.push(this.getModuleRouteDetail(this.module))
      }
    },
    /**
     * Fetch a single resource base on the primary key.
     *
     * @returns {Promise<void>}
     */
    async find () {
      this.response.reset()
      this.processing = true
      try {
        this.model = await this.show()
        this.whenFound(this.model)
      } catch (exception) {
        this.response.parse(exception)
        this.whenFailed(this.response)
      } finally {
        this.processing = false
      }
    },
    /**
     * Responsible to get the default schema to be used as model.
     * @returns {Object}
     */
    schema () {
      return this.getModuleResourceSchema(this.module, _.cloneDeep(this.value))
    },
    /**
     * Responsible to reset the form data to
     * the default state.
     * @returns {void}
     */
    reset () {
      this.model = this.schema()
      this.response.reset()
      this.processing = false
    }
  }
}
