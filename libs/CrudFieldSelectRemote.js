import CrudField from './CrudField'

export default class CrudFieldSelectRemote extends CrudField {
  constructor(fieldName) {
    super(fieldName, 'CFieldSelectRemote')
    this.perPage()
      .origin(fieldName)
      .mapValueFrom('id')
      .mapTextFrom('name')
      .mapResponse('')
  }

  /**
   * Set a dynamic parameter that should be taken from a given getter.
   *
   * @param {String} keyName
   * @param {String} vuexGetterPath
   * @returns {CrudFieldSelectRemote}
   */
  queryFromVuexGetter(keyName, vuexGetterPath) {
    this.$options.settings.params.getter = { keyName, vuexGetterPath }
    return this
  }

  /**
   * Set a dynamic parameter that should be taken from Vuex State.
   *
   * @param {String} keyName
   * @param {String} vuexStatePath
   * @returns {CrudFieldSelectRemote}
   */
  queryFromVuexState(keyName, vuexStatePath) {
    this.$options.settings.params.state = { keyName, vuexStatePath }
    return this
  }

  /**
   * Set the path to take the collection response from.
   * @param {String} path
   * @returns {CrudFieldSelectRemote}
   */
  mapResponse(path) {
    this.$options.settings.params.wrap = path
    return this
  }

  /**
   * Set the query to be added into the fetch request.
   * @param {Object} options
   * @returns {CrudFieldSelectRemote}
   */
  query(options = {}) {
    this.$options.settings.params.query = options
    return this
  }

  /**
   * Set the limit per page that should be used to fetch teh data.
   * @param {Number} rows
   * @returns {CrudFieldSelectRemote}
   */
  perPage(rows = 30) {
    this.$options.settings.params.perPage = rows
    return this
  }

  /**
   * Set the origin to make the fetch request.
   * @param {String} path
   * @returns {CrudFieldSelectRemote}
   */
  origin(path) {
    this.$options.settings.params.origin = path
    return this
  }

  /**
   * Set the path where should take the value for each option.
   * @param {String} path
   * @returns {CrudFieldSelectRemote}
   */
  mapValueFrom(path) {
    this.$options.settings.params.value = path
    return this
  }

  /**
   * Set the path where should take the text label for each option.
   * @param {String} path
   * @returns {CrudFieldSelectRemote}
   */
  mapTextFrom(path) {
    this.$options.settings.params.text = path
    return this
  }
}
