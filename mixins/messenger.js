export default {
  methods: {
    error (message) {
      this.$store.commit('messenger/error', this.$te(message) ? this.$t(message) : message)
    },
    success (message) {
      this.$store.commit('messenger/success', this.$te(message) ? this.$t(message) : message)
    }
  }
}
