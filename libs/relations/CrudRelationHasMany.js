export default class CrudRelationHasMany {
  constructor(fieldName, moduleName) {
    this.$options = {
      module: '',
      name: '',
      component: ''
    }
    this
      .module(moduleName)
      .name(fieldName)
      .component('CFieldHasMany')
  }

  /**
   * Set the component to be used for this field.
   *
   * @param {String} name
   * @returns {CrudRelationHasMany}
   */
  component(name) {
    this.$options.component = name
    return this
  }

  /**
   * Set the module name to display the relation when detail page.
   *
   * @param {String} name
   * @returns {CrudRelationHasMany}
   */
  module(name) {
    this.$options.module = name
    return this
  }

  /**
   * Set the name of the field that will be used to fetch the related data.
   *
   * @param {String} field
   * @returns {CrudRelationHasMany}
   */
  name(field) {
    this.$options.name = field
    return this
  }
}
