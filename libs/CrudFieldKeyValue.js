import CrudField from './CrudField'

export default class CrudFieldKeyValue extends CrudField {
  constructor(name) {
    super(name, 'CFieldKeyValue')
    this.value([])
  }
}
