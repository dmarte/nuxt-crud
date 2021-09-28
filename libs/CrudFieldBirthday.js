import CrudField from './CrudFieldDate'

export default class CrudFieldBirthday extends CrudField {
  constructor (fieldName) {
    super(fieldName)
    this.useTodayAsMaxDate()
    this.initialDisplayModeYear()
  }
}
