import CrudField from './CrudField'
import CrudFieldHasMany from './CrudFieldHasMany'
import CrudAction from './actions/CrudAction'

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
        primaryKey: 'id',
        resourceWrapper: '',
        perPage: [30, 50, 100, 150],
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



  withDefaultActions () {
    return this
      .withActionCreate()
      .withActionDetail()
      .withActionIndex()
      .withActionUpdate()
      .withActionDestroy()
  }

  withActionDestroy () {
    const action = new CrudAction()
    action
      .name('destroy')
      .icon('mdi-delete-outline')
      .label('crud.actions.destroy')
      .emits('destroy')
      .inline()
      .hideWhenUpdating()
      .hideWhenCreating()
      .withConfirmation()
      .confirmationTextTitle('crud.title.destroy')
      .confirmationTextSubmit('crud.actions.destroy')
      .confirmationStyleDestructive()

    return this.action(action)
  }

  /**
   * Enable the action to create a new resource.
   *
   * @returns {CrudModule}
   */
  withActionCreate () {
    const action = new CrudAction()
    action
      .name('create')
      .label('crud.actions.create')
      .icon('mdi-plus')
      .emits('create')
      .standalone()
      .showOnIndex()
      .showOnDetail()
      .hideWhenCreating()
      .hideWhenUpdating()

    if (this.$options.parent) {
      action
        .route({ name: 'crud-resource-child-create' })
        .setParamFromComponent('parentResource', 'parent')
        .setParamFromComponent('parentResourceId', 'parent_id')
        .setParamFromComponent('resource', 'resource')
    } else {
      action
        .route({ name: 'crud-resource-create' })
        .setParamFromComponent('resource', 'resource')
    }

    return this.action(action)
  }

  withActionIndex () {
    const action = new CrudAction()
    action
      .name('index')
      .label('crud.actions.index')
      .icon('mdi-format-list-numbered')
      .emits('index')
      .inline()
      .hideOnIndex()

    if (this.$options.parent) {
      action
        .route({ name: 'crud-resource-child-index' })
        .setParamFromComponent('parentResource', 'parent')
        .setParamFromComponent('parentResourceId', 'parent_id')
        .setParamFromComponent('resource', 'resource')
    } else {
      action
        .route({ name: 'crud-resource-index' })
        .setParamFromComponent('resource', 'resource')
        .setParamFromComponent('resourceId', 'resourceId')
    }

    return this.action(action)
  }

  withActionDetail () {
    const action = new CrudAction()
    action
      .name('detail')
      .label('crud.actions.detail')
      .icon('mdi-eye-outline')
      .emits('detail')
      .inline()
      .hideOnDetail()
      .setQueryFromRoute('fullPath', 'redirect')

    if (this.$options.parent) {
      action
        .route({ name: 'crud-resource-child-detail' })
        .setParamFromComponent('parentResource', 'parent')
        .setParamFromComponent('parentResourceId', 'parent_id')
        .setParamFromComponent('resource', 'resource')
    } else {
      action
        .route({ name: 'crud-resource-detail' })
        .setParamFromComponent('resource', 'resource')
        .setParamFromComponent('resourceId', 'resourceId')
    }

    return this.action(action)
  }

  withActionUpdate () {
    const action = new CrudAction()
    action
      .name('update')
      .label('crud.actions.update')
      .icon('mdi-pencil')
      .emits('update')
      .inline()
      .hideWhenCreating()
      .hideWhenUpdating()
      .setQueryFromRoute('fullPath', 'redirect')

    if (this.$options.parent) {
      action
        .route({ name: 'crud-resource-child-detail' })
        .setParamFromComponent('parentResource', 'parent')
        .setParamFromComponent('parentResourceId', 'parent_id')
        .setParamFromComponent('resource', 'resource')
    } else {
      action
        .route({ name: 'crud-resource-update' })
        .setParamFromComponent('resource', 'resource')
        .setParamFromComponent('resourceId', 'resourceId')
    }

    return this.action(action)
  }

  /**
   * Set a module that should be parent.
   *
   * @param {String} parentModuleName
   * @returns {CrudModule}
   */
  parent (parentModuleName) {
    this.$options.parent = parentModuleName
    return this
  }

  /**
   * Common path must be used when fetching a single resource.
   * @param {String} path
   * @returns {CrudModule}
   */
  wrapper (path) {
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
   * Dispatch a vuex action when an error accur on index.
   * @param {String} vuexAction
   * @returns {CrudModule}
   */
  dispatchOnIndexError(vuexAction) {
    this.$options.hooks.onIndexError = vuexAction
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
    if (field instanceof CrudFieldHasMany && field.$options.name === `${this.$options.name}.${this.$options.primaryKey}`) {
      throw new Error('You can\'t use has many field for the same definition module.')
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
