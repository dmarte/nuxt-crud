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
  constructor(name, options = {}) {
    options.name = name.toLowerCase()
    this.$options = Object.assign(
      {
        name: null,
        dense: false,
        fullscreen: false,
        form: undefined,
        head: [],
      },
      options
    )
  }

  /**
   * Forms should be displayed as full-screen when modal box opens.
   * @returns {CrudModule}
   */
  fullscreen() {
    this.$options.fullscreen = true
    return this
  }

  /**
   * Adds a heads settings to given module.
   * @param {CrudField} field
   * @returns {CrudModule}
   * @throws Error
   */
  field(field) {
    if (!field instanceof CrudField) {
      throw new Error('The field should be an instance of CrudHead object.')
    }
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
  form(name) {
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
  dense(enabled) {
    this.$options.dense = enabled
    return this
  }

  /**
   * Return a JSON representation of the CRUD.
   *
   * @returns {Object}
   */
  toObject() {
    const out = { ...this.$options }
    out.head = out.head.map((v) => v.toObject())
    return out
  }
}
