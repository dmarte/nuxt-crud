export default class CrudHead {
  /**
   * @param {Object} options
   */
  constructor(options) {
    this.$options = Object.assign(
      {
        visibility: {
          creating: true,
          updating: true,
          index: true,
          detail: false,
        },
        label: undefined,
        name: undefined,
        sortable: false,
        component: CrudHead.FIELD_TYPE_TEXT,
        disabled: false,
        readonly: false,
        value: undefined,
        options: [],
      },
      options
    )
  }

  static get FIELD_TYPE_TEXT() {
    return 'CFieldText'
  }

  static get DISPLAY_MODE_INDEX() {
    return 'Index'
  }
  static get DISPLAY_MODE_FORM() {
    return 'Form'
  }
  static get DISPLAY_MODE_DETAIL() {
    return 'Detail'
  }

  /**
   * Hides the current head on index.
   * @returns {CrudHead}
   */
  hideOnIndex() {
    this.$options.visibility.index = false
    return this
  }

  /**
   * Hides a given field when creating.
   * @returns {CrudHead}
   */
  hideWhenCreating() {
    this.$options.visibility.creating = false
    return this
  }

  /**
   * Hides a given head when updating.
   * @returns {CrudHead}
   */
  hideWhenUpdating() {
    this.$options.visibility.updating = false
    return this
  }

  /**
   * Hides a given head when updating.
   * @returns {CrudHead}
   */
  hideOnDetail() {
    this.$options.visibility.detail = false
    return this
  }

  /**
   * Hide this field when presenting forms.
   * @returns {CrudHead}
   */
  hideOnForms() {
    this.hideWhenCreating().hideWhenUpdating()
    return this
  }

  /**
   * Hide this field when a given condition occurs.
   *
   * @param {Function} callback
   * @returns {CrudHead}
   */
  hideWhen(callback) {
    this.$options.condition = callback
    return this
  }

  /**
   * Set the label visible for the field.
   *
   * @param {String} text
   * @returns {CrudHead}
   */
  label(text) {
    this.$options.label = text
    return this
  }

  /**
   * Indicate the object path to get the data for this crud.
   * @param {String} name
   * @returns {CrudHead}
   */
  name(name) {
    this.$options.name = name
    return this
  }

  /**
   * Set the component name to be used.
   *
   * @param {String} name
   * @returns {CrudHead}
   */
  component(name) {
    this.$options.component = name
    return this
  }

  /**
   * Make this field sortable on index.
   * @returns {CrudHead}
   */
  sortable() {
    this.$options.sortable = true
    return this
  }

  /**
   * Mark this field as READ only.
   * @returns {CrudHead}
   */
  readonly() {
    this.$options.readonly = true
    return this
  }

  /**
   * Set the current value or default value.
   * @param {Array|Object|String|Number} value
   * @returns {CrudHead}
   */
  value(value) {
    this.$options.value = value
    return this
  }

  /**
   * Exports to object the current CrudHead
   * @returns {map<Function>, display<Function>, condition<Function>}
   */
  toObject() {
    return { ...this.$options }
  }
}
