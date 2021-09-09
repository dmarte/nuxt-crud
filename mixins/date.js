import field from './field'

export default {
  mixins: [field],
  methods: {
    resolveMinOrMaxValue (value) {
      if (!value) { return undefined }
      if (value.includes(':')) {
        return this.resolveTrigger(value)
      }
      return value
    },
    resolveTrigger (val) {
      const parts = val.split(':')
      let triggerName = parts.shift()
      const triggerValue = parts.shift()

      triggerName = `trigger${triggerName.charAt(0)
      .toUpperCase()}${triggerName.substr(1)}`

      return this[triggerName] ? this[triggerName](triggerValue) : undefined
    },
    triggerDate (value) {
      switch (value) {
        case 'today':
          return this.storeFormat(this.$moment().toDate())
        case 'tomorrow':
          return this.storeFormat(this.$moment().add(1, 'day').toDate())
        case 'next_year':
          return this.storeFormat(this.$moment().add(1, 'year').toDate())
        case 'next_month':
          return this.storeFormat(this.$moment().add(1, 'month').toDate())
      }
      return value
    },
    storeFormat (date) {
      if (!date) {
        return null
      }
      return this.$moment(date).format(this.params.store_format)
    },
    displayFormat (date) {
      if (!date) {
        return ''
      }
      return this.$moment(date).format(this.params.display_format)
    }
  }
}
