import CrudField from './CrudField'

export default class CrudFieldHeading extends CrudField {
  constructor (fieldName) {
    super(fieldName, 'CFieldHeading')
    this.hideOnIndex()
  }
}
