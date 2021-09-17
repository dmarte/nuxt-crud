import CrudField from './CrudField'
import CrudAction from './actions/CrudAction'
import CrudActionCreate from './actions/CrudActionCreate'
import CrudActionDetail from './actions/CrudActionDetail'
import CrudActionUpdate from './actions/CrudActionUpdate'
import CrudActionIndex from './actions/CrudActionIndex'
import CrudActionDelete from './actions/CrudActionDelete'

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
        parent: null,
        dense: false,
        fullscreen: false,
        width: 250, // Size of the form in modal
        form: undefined,
        primaryKey: 'id',
        resourceWrapper: '',
        perPage: [10, 30, 50, 100, 150],
        routes: {
          login: 'login'
        },
        settings: {},
        hooks: {
          beforeCreate: undefined,
          beforeUpdate: undefined
        },
        /**
         * @type {Array<CrudField>}
         */
        filters: [],
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
   * Set the default crud actions.
   * @returns {CrudModule}
   */
  withDefaultActions () {
    return this.withActionCreate()
  }

  /**
   * Enable the action to create a new resource.
   *
   * @returns {CrudModule}
   */
  withActionCreate() {
    const action = new CrudAction()
    action
      .name('create')
      .label('crud.actions.create')
      .icon('mdi-plus')
      .emits('create')
      .standalone()

    if (this.$options.parent) {
      action
        .route({ name: 'crud-resource-child-create' })
        .setParamFromComponent('parentResource', 'parent')
        .setParamFromComponent('parentResourceId', 'parent_id')
        .setParamFromComponent('resource', 'resource')
        .setQueryFromRoute('fullPath', 'redirect')
    } else {
      action
        .route({ name: 'crud-resource-create' })
        .setParamFromComponent('resource', 'resource')
        .setQueryFromRoute('fullPath', 'redirect')
    }

    return this.action(action)
  }

  /**
   * Set a module that should be parent.
   *
   * @param {String} parentModuleName
   * @returns {CrudModule}
   */
  parent(parentModuleName) {
    this.$options.parent = parentModuleName
   return this
  }

  /**
   * Common path must be used when fetching a single resource.
   * @param {String} path
   * @returns {CrudModule}
   */
  wrapper(path) {
    this.$options.resourceWrapper = path
    return this
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
    action.$options.module = this.$options.name
    action.$options.parent = this.$options.parent
    this.$options.actions.push(action)
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
    if (!(field instanceof CrudField)) {
      throw new TypeError('The field should be an instance of CrudHead object.')
    }
    field.dense(this.$options.dense)
    this.$options.head.push(field)
    return this
  }

  /**
   * Set the field as part of the filters.
   *
   * @param {CrudField} field
   * @returns {CrudModule}
   */
  filter (field) {
    return this.field(field.filterable())
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
