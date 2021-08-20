export default {
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
