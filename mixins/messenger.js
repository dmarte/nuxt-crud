export default {
  methods: {
    error(message) {
      this.$store.commit('messenger/error', message)
    },
    success(message) {
      this.$store.commit('messenger/success', message)
    },
  }
}
