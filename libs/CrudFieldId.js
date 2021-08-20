import CrudFieldNumber from './CrudFieldNumber'

export default class CrudFieldId extends CrudFieldNumber {
  constructor(name = 'id') {
    super(name)
    this.readonly()
  }

  min(value = 0) {
    this.$options.min_value = value
    return this
  }

  max(value = 0) {
    this.$options.max_value = value
  }
}
