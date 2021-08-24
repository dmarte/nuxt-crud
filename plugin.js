const settings = Object.assign(
  {},
  JSON.parse('<%=JSON.stringify({ modules: options.modules })%>'),
  {}
)

export default ({ store }, inject) => {
  inject('crud', settings)
  store.registerModule(
    'breadcrumbs',
    {
      namespaced: true,
      strict: true,
      state() {
        return {
          collection: []
        }
      },
      mutations: {
        set(state, breadcrumbs) {
          state.collection = breadcrumbs
        }
      }
    }
  )
  store.registerModule(
    'messenger',
    {
      namespaced: true,
      strict: true,
      state() {
        return {
          type: 'success',
          text: null,
          opened: false
        }
      },
      mutations: {
        success(state, message) {
          state.text = message
          state.opened = true
          state.type = 'success'
        },
        error(state, message) {
          state.text = message
          state.opened = true
          state.type = 'error'
        },
        close(state) {
          state.text = null
          state.opened = false
          state.type = null
        }
      }
    }
  )
}
