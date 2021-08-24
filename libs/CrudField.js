import CrudHead from './CrudHead'

export default class CrudField extends CrudHead {
  constructor(name, type) {
    super()
    this.name(name)
    this.label(name)
    this.component(type)
    this.value(null)
  }

  /**
   * Create a dependency based on a given field name.
   *
   * @param {String} name
   * @returns {CrudField}
   */
  dependsOnFieldName(name) {
    if (!name) {
      return this
    }
    this.$options.dependency = field.$options.name
    return this
  }
}
