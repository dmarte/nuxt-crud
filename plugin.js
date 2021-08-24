const settings = Object.assign(
  {},
  JSON.parse('<%=JSON.stringify({ modules: options.modules })%>'),
  {}
)

export default ({ store }, inject) => {
  inject('crud', settings)
  store.registerModule(
    'breadcrumbs',
    JSON.parse('<%=JSON.stringify(options.store.breadcrumbs)%>')
  )
  store.registerModule(
    'messenger',
    JSON.parse('<%=JSON.stringify(options.store.messenger)%>')
  )
}
