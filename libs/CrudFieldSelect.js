import CrudField from './CrudField'

export default class CrudFieldSelect extends CrudField {
  constructor(name) {
    super(name, 'CFieldSelect')
  }

  /**
   * Set the options to be used.
   *
   * @param {Array<{text, value}>} items
   * @returns {CrudFieldSelect}
   */
  options(items =[]) {
    this.$options.settings.items = items
    return this
  }
}
