import CrudHead from './CrudHead'

export default class CrudField extends CrudHead {
  constructor (name, type) {
    super()
    this.name(name)
    this.label(name)
    this.component(type)
    this.value(null)
  }

  /**
   * Set the field available to use but also included on filters panel.
   * @returns {CrudField}
   */
  filterable () {
    return this.showOnFilters()
  }

  /**
   * Only display the field as filter.
   * @returns {CrudHead}
   */
  onlyOnFilters () {
    this.$options.settings.filter = true
    return this.hideOnIndex().hideOnForms().hideOnDetail().filterable()
  }

  /**
   * Display the field within filters panel.
   * @returns {CrudField}
   */
  showOnFilters () {
    this.$options.settings.visibility.filter = true
    return this
  }
}
