import CrudField from './CrudField'

export default class CrudFieldDate extends CrudField {
  constructor (fieldName) {
    super(fieldName, 'CFieldDate')
    this.displayFormat('D MMM YYYY')
    this.storeFormat('YYYY-MM-DD')
    this.initialDisplayModeDate()
  }

  /**
   *
   * @param type
   * @param format
   * @returns {CrudFieldDate}
   */
  format (type, format) {
    this.$options.settings.params[`${type}_format`] = format
    return this
  }

  valueFromCurrentDate () {
    return this.valueDynamic('getCurrentDate')
  }

  initialDisplayMode (type) {
    this.$options.settings.params.display = type
    return this
  }

  initialDisplayModeYear () {
    this.initialDisplayMode('YEAR')
    return this
  }

  initialDisplayModeMonth () {
    this.initialDisplayMode('MONTH')
    return this
  }

  initialDisplayModeDate () {
    this.initialDisplayMode('DATE')
    return this
  }

  useNextYearAsMinDate () {
    return this.min('date:next_year')
  }

  useNextMonthAsMinDate () {
    return this.min('date:next_month')
  }

  useNextYearAsMaxDate () {
    return this.max('date:next_year')
  }

  useNextMonthAsMaxDate () {
    return this.max('date:next_month')
  }

  useTodayAsMinDate () {
    return this.min('date:today')
  }

  useTomorrowAsMinDate () {
    return this.min('date:tomorrow')
  }

  useTodayAsMaxDate () {
    return this.max('date:today')
  }

  useTomorrowAsMaxDate () {
    return this.max('date:tomorrow')
  }

  /**
   * Set the format the date must be displayed.
   *
   * @param {String} value
   * @returns {CrudFieldDate}
   */
  displayFormat (value) {
    return this.format('display', value)
  }

  /**
   * Set the format the value must be emitted.
   *
   * @param {String} value
   * @returns {CrudFieldDate}
   */
  storeFormat (value) {
    return this.format('store', value)
  }
}
