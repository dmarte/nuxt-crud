export default {
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
