export default {
  methods: {
    format (value) {
      if (this.params.without_format) {
        return value
      }
      return new Intl.NumberFormat('en', {
        maximumFractionDigits: 2,
        maximumSignificantDigits: 2,
        minimumFractionDigits: 2
      }).format(value)
    }
  }
}
