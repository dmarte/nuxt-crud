import CrudField from './CrudField'

export default class CrudFieldPhone extends CrudField {
  constructor (fieldName) {
    super(fieldName, 'CFieldPhone')
  }

  whatsapp () {
    this.$options.settings.params.is_whatsapp = true
    return this
  }
}
