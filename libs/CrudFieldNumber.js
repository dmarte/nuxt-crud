import CrudField from './CrudField'

export default class CrudFieldNumber extends CrudField {
  constructor (name) {
    super(name, 'CFieldNumber')
  }

  withoutFormat () {
    this.$options.settings.params.without_format = true
    return this
  }

  min (value = 0) {
    this.$options.min_value = value
    return this
  }

  max (value = 0) {
    this.$options.max_value = value
    return this
  }
}
