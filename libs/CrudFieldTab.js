import CrudField from './CrudField'

export default class CrudFieldTab extends CrudField {
  constructor (label) {
    super(label, 'CFieldTab')
    this.label(label)
    this.$options.settings.params.fields = []
    this.$options.settings.params.actions = []
  }

  field (field) {
    this.$options.settings.params.fields.push(field)
    return this
  }

  toObject () {
    const obj = super.toObject()
    obj.settings.params.fields = obj.settings.params.fields.map(field => field.toObject())
    return obj
  }
}
