export default class CrudAction {
  constructor() {
    this.$options = {
      module: null,
      icon: null,
      label: null,
      route: undefined,
      inline: false,
      standalone: false,
      params: {},
      query: {},
      confirmation: {
        enabled: false,
        textTitle: 'crud.action.title',
        textBody:null,
        textSubmit: 'crud.action.body',
        textCancel: 'crud.action.cancel'
      },
      visibility: {
        index: true,
        detail: true,
        creating: false,
        updating: false
      },
      vuex: {
        action: undefined,
      },
    }
  }

  dynamicParam(prefix, path, name) {
    const key = prefix ? `${prefix}.${path}` : path
    this.$options.params[key] = name
    return this
  }

  dynamicQuery(prefix, path, name) {
    const key = prefix ? `${prefix}.${path}` : path
    this.$options.query[key] = name
    return this
  }

  setParamFromVuexState(statePath, paramName) {
    return this.dynamicParam('$store.state', statePath, paramName)
  }

  setParamFromVuexGetter(getterPath, paramName) {
    return this.dynamicParam('$store.getters', getterPath, paramName)
  }

  setParamFromRoute(routePath, paramName) {
    return this.dynamicParam('$route', routePath, paramName)
  }

  setParamFromComponent(componentPath, paramName) {
    return this.dynamicParam('', componentPath, paramName)
  }

  setQueryFromVuexState(statePath, paramName) {
    return this.dynamicQuery('$store.state', statePath, paramName)
  }

  setQueryFromVuexGetter(getterPath, paramName) {
    return this.dynamicQuery('$store.getters', getterPath, paramName)
  }

  setQueryFromRoute(routePath, paramName) {
    return this.dynamicQuery('$route', routePath, paramName)
  }

  setQueryFromComponent(componentPath, paramName) {
    return this.dynamicQuery('', componentPath, paramName)
  }

  setParamFromPrimaryKey() {
    return this.setParamFromComponent('primaryKey', 'id')
  }

  withConfirmation() {
    this.$options.confirmation.enabled = true
    return this
  }

  confirmationTextTitle(text) {
    this.$options.confirmation.textTitle = text
    return this
  }

  confirmationTextBody(text) {
    this.$options.confirmation.textBody = text
    return this
  }

  confirmationTextCancel(text) {
    this.$options.confirmation.textCancel = text
    return this
  }

  confirmationTextSubmit(text) {
    this.$options.confirmation.textSubmit = text
    return this
  }

  /**
   * Set the module name where this action should be used.
   * @param {String} name
   * @returns {CrudAction}
   */
  module(name) {
    this.$options.module = name
    return this
  }

  /**
   * Hide this action from index view.
   * @returns {CrudAction}
   */
  hideOnIndex() {
    this.$options.visibility.index = false
    return this
  }

  /**
   * Hide his action from detail page.
   * @returns {CrudAction}
   */
  hideOnDetail() {
    this.$options.visibility.detail = false
    return this
  }

  hideWhenCreating() {
    this.$options.visibility.creating = false
    return this
  }

  hideWhenUpdating(){
    this.$options.visibility.updating = false
    return this
  }

  /**
   * Show this action when creating a new resource.
   * @returns {CrudAction}
   */
  showWhenCreating() {
    this.$options.visibility.creating = true
    return this
  }

  /**
   * Show this action when updating the resource.
   * @returns {CrudAction}
   */
  showWhenUpdating(){
    this.$options.visibility.updating = true
    return this
  }

  /**
   * Show the action on index.
   * @returns {CrudAction}
   */
  showOnIndex() {
    this.$options.visibility.index = true
    return this
  }

  /**
   * Show this action on detail.
   * @returns {CrudAction}
   */
  showOnDetail() {
    this.$options.visibility.detail = true
    return this
  }

  /**
   * Show this action only on detail.
   * @returns {CrudAction}
   */
  onlyOnDetail() {
    this
      .showOnDetail()
      .hideOnIndex()
      .hideWhenCreating()
      .hideWhenUpdating()
      .standalone()
    return this
  }

  /**
   * Set the action to be displayed inline of toolbar.
   * @returns {CrudAction}
   */
  inline() {
    this.$options.inline = true
    return this
  }

  /**
   * Set the VUEX dispatch action must be call when click.
   *
   * @param {String} name
   * @returns {CrudAction}
   */
  dispatcher(name) {
    this.$options.vuex.action = name
    return this
  }

  /**
   * Set the route (means this action is a redirection).
   *
   * @param {Vue.$route} route
   * @returns {CrudAction}
   */
  route(route) {
    this.$options.route = route
    return this
  }

  /**
   * Set the action as standalone
   * (No related to any resource in list).
   *
   * @returns {CrudAction}
   */
  standalone() {
    this.$options.standalone = true
    return this
  }

  /**
   * Set the icon to be shown for this action.
   * @param {String} name
   * @returns {CrudAction}
   */
  icon(name) {
    this.$options.icon = name
    return this
  }

  /**
   * Set the label (text) for this action.
   * @param {String} text
   * @returns {CrudAction}
   */
  label(text) {
    this.$options.label = text
    return this
  }

  /**
   * Get the JSON representation of current action.
   *
   * @returns {CrudAction.$options}
   */
  toObject() {
    return this.$options
  }
}
