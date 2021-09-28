export default {
  methods: {
    format (value) {
      return new Intl.NumberFormat(this.$i18n.locale, {
        maximumFractionDigits: 2,
        maximumSignificantDigits: 2
      }).format(value)
    }
  }
}
