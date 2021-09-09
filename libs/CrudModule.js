import CrudField from './CrudField'
/**
 * This class represent a base wrapper
 * to configure a module.
 *
 */
export default class CrudModule {
  /**
   * Create a new Module.
   *
   * @param {String} name
   * @param {Object} options
   */
  constructor (name, options = {}) {
    this.$options = Object.assign(
      {
        name,
        dense: false,
        fullscreen: false,
        width: 250, // Size of the form in modal
        form: undefined,
        primaryKey: 'id',
        perPage: 30,
        routes: {
          login: 'login'
        },
        hooks: {
          beforeCreate: undefined,
          beforeUpdate: undefined
        },
        /**
         * @type {Array<CrudField>}
         */
        head: [],
        /**
         * @type {Array<CrudAction>}
         */
        actions: []
      },
      options
    )
  }

  /**
   * Dispatch a vuex action before create.
   * @param {String} vuexAction
   * @returns {CrudModule}
   */
  dispatchBeforeCreate (vuexAction) {
    this.$options.hooks.beforeCreate = vuexAction
    return this
  }

  /**
   * Dispatch an action before update.
   * @param {String} vuexAction
   * @returns {CrudModule}
   */
  dispatchBeforeUpdate (vuexAction) {
    this.$options.hooks.beforeUpdate = vuexAction
    return this
  }

  /**
   * Add an action to a given module.
   *
   * @param {CrudAction} action
   * @returns {CrudModule}
   */
  action (action) {
    action.module(this.$options.name)
    this.$options.actions.push(action)
    return this
  }

  /**
   * Forms should be displayed as full-screen when modal box opens.
   * @returns {CrudModule}
   */
  fullscreen () {
    this.$options.fullscreen = true
    return this
  }

  /**
   * Set the primary key for the.
   * @param {String} name
   * @returns {CrudModule}
   */
  primaryKey (name) {
    this.$options.primaryKey = name
    return this
  }

  /**
   * Adds a heads settings to given module.
   * @param {CrudField} field
   * @returns {CrudModule}
   * @throws Error
   */
  field (field) {
    if (!field instanceof CrudField) {
      throw new TypeError('The field should be an instance of CrudHead object.')
    }
    field.dense(this.$options.dense)
    this.$options.head.push(field)
    return this
  }

  /**
   * Let you set the name of the component that should
   * be used as the form editor.
   *
   * @param {String} name
   * @return {CrudModule}
   */
  form (name) {
    this.$options.form = name
    return this
  }

  /**
   * Indicate if the lists in the given module
   * should be compacted.
   *
   * @param {Boolean} enabled
   * @return {CrudModule}
   */
  dense (enabled) {
    this.$options.dense = enabled
    return this
  }

  /**
   * Return a JSON representation of the CRUD.
   *
   * @returns {Object}
   */
  toObject () {
    const out = { ...this.$options }
    out.head = out.head.map(v => v.toObject())
    out.actions = out.actions.map(v => v.toObject())
    return out
  }
}
