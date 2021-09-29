import CrudField from './CrudField'

export default class CrudFieldBoolean extends CrudField {
  constructor(fieldName) {
    super(fieldName, 'CFieldBoolean')
    this.trueValue(true).falseValue(false).value(false)
  }
  trueValue(value) {
    this.$options.settings.params.trueValue = value
    return this
  }
  falseValue(value){
    this.$options.settings.params.falseValue = value
    return this
  }
}
