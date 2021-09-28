export default class CrudHead {
  constructor (options) {
    this.$options = Object.assign(
      {
        settings: {
          filter: false,
          visibility: {
            create: true,
            update: true,
            index: true,
            detail: true,
            filter: false,
            when_field_name: null,
            when_field_value: null
          },
          sortable: false,
          readonly: false,
          value: null,
          // Used to take the value  dynamically
          valuePath: undefined,
          append_icon: null,
          prepend_icon: null,
          clearable: false,
          dense: false,
          persistent_hint: false,
          persistent_placeholder: false,
          rules: [],
          items: [],
          hooks: [],
          params: {},
          min_value: null,
          max_value: null
        },
        label: null,
        component: CrudHead.FIELD_TYPE_TEXT,
        type: null,
        name: null,
        placeholder: null,
        hint: null,
        enabled: true
      },
      options
    )
  }

  /**
   * Component name for field texts.
   *
   * @returns {string}
   * @constructor
   */
  static get FIELD_TYPE_TEXT () {
    return 'CFieldText'
  }

  /**
   * Component name for field texts.
   *
   * @returns {string}
   * @constructor
   */
  static get FIELD_TYPE_SELECT () {
    return 'CFieldSelect'
  }

  /**
   * Display mode used to represent the index state.
   *
   * NOTE: This is used as suffix for field components.
   * @returns {string}
   * @constructor
   */
  static get DISPLAY_MODE_INDEX () {
    return 'Index'
  }

  /**
   * Display mode used to represent the form state.
   *
   * NOTE: This is used as suffix for field components.
   * @returns {string}
   * @constructor
   */
  static get DISPLAY_MODE_FORM () {
    return 'Form'
  }

  /**
   * Display mode used to represent the detail state.
   *
   * NOTE: This is used as suffix for field components.
   * @returns {string}
   * @constructor
   */
  static get DISPLAY_MODE_DETAIL () {
    return 'Detail'
  }

  /**
   * Hides the current head on index.
   * @returns {CrudHead|CrudField}
   */
  hideOnIndex () {
    this.$options.settings.visibility.index = false
    return this
  }

  /**
   * Hides a given field when create.
   * @returns {CrudHead|CrudField}
   */
  hideWhenCreating () {
    this.$options.settings.visibility.create = false
    return this
  }

  /**
   * Hides a given head when update.
   * @returns {CrudHead|CrudField}
   */
  hideWhenUpdating () {
    this.$options.settings.visibility.update = false
    return this
  }

  /**
   * Hides a given head when update.
   * @returns {CrudHead|CrudField}
   */
  hideOnDetail () {
    this.$options.settings.visibility.detail = false
    return this
  }

  /**
   * Hide this field when presenting forms.
   * @returns {CrudHead|CrudField}
   */
  hideOnForms () {
    this.hideWhenCreating().hideWhenUpdating()
    return this
  }

  /**
   * Show a given field only on form page.
   * @returns {CrudHead|CrudField}
   */
  onlyOnForms () {
    this.hideOnIndex().hideOnDetail()
    this.$options.settings.visibility.create = true
    this.$options.settings.visibility.update = true
    return this
  }

  /**
   * Show only when create.
   * @returns {CrudHead|CrudField}
   */
  onlyWhenCreating () {
    this.hideOnIndex()
      .hideOnDetail()
      .hideWhenUpdating()
    this.$options.settings.visibility.create = true
    return this
  }

  /**
   * Show only when create.
   * @returns {CrudHead|CrudField}
   */
  onlyWhenUpdating () {
    this.hideOnIndex()
      .hideOnDetail()
      .hideWhenCreating()
    this.$options.settings.visibility.update = true
    return this
  }

  /**
   * Show a given field only on detail pay.
   * @returns {CrudHead|CrudField}
   */
  onlyOnDetail () {
    this.hideOnIndex()
      .hideWhenCreating()
      .hideWhenUpdating()
    this.$options.settings.visibility.detail = true
    return this
  }

  /**
   * Display the current field based on value(s) from other field name in the
   * same module.
   *
   * @param {String} name
   * @param {String|Array<String>} value
   * @returns {CrudField}
   */
  visibleWhen (name, value) {
    if (!name) {
      return this
    }
    this.$options.settings.visibility.when_field_name = name
    this.$options.settings.visibility.when_field_value = value
    return this
  }

  min (value) {
    this.$options.settings.params.min = value
    return this
  }

  max (value) {
    this.$options.settings.params.max = value
    return this
  }

  /**
   * Set the field
   * @param {Boolean} enabled
   * @returns {CrudHead|CrudField}
   */
  dense (enabled = true) {
    this.$options.settings.dense = enabled
    return this
  }

  /**
   * Set the field
   * @param {Boolean} enabled
   * @returns {CrudHead|CrudField}
   */
  clearable (enabled = true) {
    this.$options.settings.clearable = enabled
    return this
  }

  /**
   * Set the label visible for the field.
   *
   * @param {String} text
   * @returns {CrudHead|CrudField}
   */
  label (text) {
    this.$options.label = text
    return this
  }

  /**
   * Indicate the object path to get the data for this crud.
   * @param {String} name
   * @returns {CrudHead|CrudField}
   */
  name (name) {
    this.$options.name = name
    return this
  }

  /**
   * Set the component name to be used.
   *
   * @param {String} name
   * @returns {CrudHead|CrudField}
   */
  component (name) {
    this.$options.component = name
    return this
  }

  /**
   * Make this field sortable on index.
   * @returns {CrudHead|CrudField}
   */
  sortable () {
    this.$options.settings.sortable = true
    return this
  }

  /**
   * Mark this field as READ only.
   * @returns {CrudHead|CrudField}
   */
  readonly () {
    this.$options.readonly = true
    return this
  }

  /**
   * Set the current value or default value.
   * @param {Array|Object|String|Number|Boolean} value
   * @returns {CrudHead|CrudField}
   */
  value (value) {
    this.$options.settings.value = value
    return this
  }

  /**
   * Used to get the value dynamically from a given path.
   * @param {String} path
   * @returns {CrudHead}
   */
  valueDynamic (path) {
    this.$options.settings.valuePath = path
    return this
  }

  /**
   * Get the value from a given vuex state.
   *
   * @param {String} statePath
   * @returns {CrudHead|CrudField}
   */
  valueFromVuexState (statePath) {
    this.valueDynamic(`$store.state.${statePath}`)
    return this
  }

  /**
   * Set the value from resource parent ID when available.
   *
   * @returns {CrudHead}
   */
  valueFromResourceParent () {
    return this.valueDynamic('parentResourceId')
  }

  /**
   * Set the value from resource ID (when available).
   *
   * @returns {CrudHead}
   */
  valueFromResource () {
    return this.valueDynamic('resourceId')
  }

  /**
   * Get the value from a given vuex state.
   *
   * @param {String} getterPath
   * @returns {CrudHead|CrudField}
   */
  valueFromVuexGetter (getterPath) {
    this.valueDynamic(`$store.getters.${getterPath}`)
    return this
  }

  /**
   * Exports to object the current CrudHead
   * @returns {map<Function>, display<Function>, condition<Function>}
   */
  toObject () {
    return { ...this.$options }
  }
}
