import OgResponse from '../libs/CrudResponse'
import components from './components'
import _ from 'lodash'

export default {
  mixins: [components],
  props: {
    title: {
      type: String,
      default() {
        const key = this.isUpdating ? 'module.actions.edit' : 'module.actions.create'
        const resource = this.$te(`module.title.${this.module}`)
          ? this.$tc(`module.title.${this.module}`, 1)
          : this.module

        return this.$te(key) ? this.$t(key, {resource}) : this.module
      }
    },
    /**
     * The name of the parameter in the route
     * to work with fetching.
     */
    keyParam: {
      type: String,
      default: null
    },
    value: {
      type: [Object, String, Array, Number],
      default: () => ({}),
    },
  },
  data() {
    return {
      response: new OgResponse(),
      processing: false,
      model: {},
    }
  },
  created() {
    this.reset()
  },
  computed: {
    isUpdating() {
      return !!this.getPrimaryKey()
    },
    isCreating() {
      return !this.isUpdating
    },
  },
  methods: {
    /**
     * Get the translation label.
     * @param {String} label
     * @returns {String}
     */
    getTranslation(label) {
      if (this.$te(`attributes.${label}`)) {
        return this.$tc(`attributes.${label}`, 1).toString()
      }

      if (this.$te(`custom.${this.module}.${label}`)) {
        return this.$tc(`custom.${this.module}.${label}`, 1).toString()
      }

      if (this.$te(label)) {
        return this.$t(label).toString()
      }


      return label
    },
    /**
     * Get a value from model or form value path.
     * @param {String} path
     * @param {String|Array|Object|Number|undefined} defaults
     * @returns {Exclude<{}[never], undefined>}
     */
    getValuePath(path, defaults = null) {
      return _.get(this.model, path, _.get(this.value, path, defaults))
    },
    /**
     * Set a value into the current model.
     * @param {String} path
     * @param {String|Array|Object|Number|undefined} value
     * @returns {default.methods}
     */
    setValuePath(path, value) {
      _.set(this.model, path, value)
      return this
    },
    /**
     * Get the name of the primary key used.
     * @returns {string}
     */
    getPrimaryKeyName() {
      const module = this.$crud.modules.find(({name}) => name === this.module)
      if (!module) {
        return 'id'
      }
      return  module.primaryKey || 'id'
    },
    /**
     * This method allow you to get
     * the name of the key used as
     * parameter in the route.
     *
     * @returns {String}
     */
    getPrimaryKeyParamName() {
      if (this.keyParam) {
        return this.keyParam
      }
      const tmp = this.singular(this.module)
      if (this.$route.params[tmp]) {
        return this.$route.params[tmp]
      }
      return this.getPrimaryKeyName()
    },
    /**
     * Get the primary key used in the route param.
     * @returns {string|null}
     */
    getPrimaryKeyFromParams() {
      return this.$route.params[this.getPrimaryKeyParamName()] || null
    },
    /**
     * @returns {String|Number|null}
     */
    getPrimaryKey() {
      return (
        this.value[this.getPrimaryKeyName()] ||
        this.model[this.getPrimaryKeyName()] ||
        this.getPrimaryKeyFromParams() ||
        null
      )
    },
    getModuleUrl() {
      return `${this.$crud.api.prefix}${this.plural(this.module)}`
    },
    getModuleUrlStore() {
      return this.getModuleUrl()
    },
    getModuleUrlUpdate() {
      return [this.getModuleUrl(), this.getPrimaryKey()].join('/')
    },
    getModuleUrlDestroy() {
      return this.getModuleUrlUpdate()
    },
    getModuleUrlShow() {
      return this.getModuleUrlUpdate()
    },
    async find() {
      return await this.$axios.$get(this.getModuleUrlShow())
    },
    async store() {
      return await this.$axios.$post(this.getModuleUrlStore(), this.model)
    },
    async update() {
      return await this.$axios.$put(this.getModuleUrlUpdate(), this.model)
    },
    async destroy() {
      return await this.$axios.$delete(this.getModuleUrlDestroy())
    },
    async show() {
      return await this.$axios.$get(this.getModuleUrlShow())
    },
    async whenDestroy() {
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
    async whenSave() {
      this.response.reset()
      this.processing = true
      try {
        if (this.isUpdating) {
          const response = await this.update()
          this.saved(response)
          this.updated(response)
        } else {
          const response = await this.store()
          this.saved(response)
          this.created(response)
        }
        setTimeout(this.reset)
      } catch (exception) {
        this.response.parse(exception)
        this.failed(this.response)
      } finally {
        this.processing = false
      }
    },
    /**
     * Fetch a single resource base on the primary key.
     *
     * @returns {Promise<void>}
     */
    async fetchOne() {
      this.response.reset()
      this.processing = true
      try {
        const rep = await this.find()
        this.model = rep.data
        this.saved(this.model)
      } catch (exception) {
        this.response.parse(exception)
        this.failed(this.response)
      } finally {
        this.processing = false
      }
    },
    /**
     * When an action (any) is cancelled.
     * USEFUL TO BYPASS THE ACTION.
     * @param {OgResponse?} response
     * @returns {void}
     */
    whenCancelled(response) {
      this.cancelled(response)
    },
    /**
     * Trigger when the element is saved.
     * @param {Object} item
     * @returns {void}
     */
    saved(item) {
      this.$emit('save:success', item)
    },
    /**
     * Responsible to notify when
     * an item of the list is destroyed.
     *
     * @param {Object} item
     * @returns {void}
     */
    destroyed(item) {
      this.success(this.$t('Resource deleted'))
      this.$emit('destroy:success', item)
    },
    /**
     * Responsible to notify when updated resource.
     * @param {Object} item
     * @returns {void}
     */
    updated(item) {
      this.success(this.$t('Resource updated'))
      this.$emit('input', item)
      this.$emit('update:success', item)
    },
    /**
     * Responsible to notify when created resource.
     * @param {Object} item
     * @returns {void}
     */
    created(item) {
      this.success(this.$t('Resource created'))
      this.$emit('input', item)
      this.$emit('create:success', item)
    },
    /**
     * Responsible to notify when failed any operation.
     * @param {OgResponse} response
     */
    failed(response) {
      this.error(
        this.$te(response.message)
          ? this.$t(response.message)
          : response.message
      )
      this.$emit('failed', response)
    },
    /**
     * Responsible to notify when cancelled operation occurs.
     * @param {OgResponse?} response
     * @returns {void}
     */
    cancelled(response) {
      if (response) {
        this.response.reset()
      }
      this.$emit('cancel')
    },
    /**
     * Responsible to get the default schema to be used as model.
     * @returns {Object}
     */
    schema() {
      return _.cloneDeep(this.value)
    },
    /**
     * Responsible to reset the form data to
     * the default state.
     * @returns {void}
     */
    reset() {
      this.model = this.schema()
      this.response.reset()
      this.processing = false
    },
  },
}
