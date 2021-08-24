import _ from 'lodash'
import components from './components'
export default {
  mixins: [components],
  computed: {
    RULE_REQUIRED: () => 'required',
    RULE_REQUIRED_IF: () => 'required_if',
    rules() {
      return [this.RULE_REQUIRED]
    },
    headers() {
      return [
        {
          text: this.$t('attributes.label'),
          value: 'label',
        },
      ]
    },
    items() {
      return this.rules.map((rule) => ({
        id: rule,
        label: this.translate(rule),
        hook: this.hook(rule),
      }))
    },
  },
  methods: {
    translate(rule) {
      return this.$te(`rules.${rule}`) ? this.$t(`rules.${rule}`) : rule
    },
    hook(rule) {
      const method = `validate${_.camelCase(rule)}`
      if (!this[method] || !_.isFunction(this[method])) {
        return (value) => value
      }
      return this[method]
    },
  },
}
