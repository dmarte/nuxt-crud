import CrudField from './CrudField'

export default class CrudFieldTags extends CrudField {
  constructor(fieldName) {
    super(fieldName, 'CFieldTags')
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
