import CrudField from './CrudField'

export default class CrudFieldNumber extends CrudField {
  constructor (name) {
    super(name, 'CFieldNumber')
  }

  format () {
    this.$options.params.format = '0,0.00'
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
