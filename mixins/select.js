import { isObject } from 'lodash'
import translator from './translator'
import field from './field'

export default {
  mixins: [translator, field],
  computed: {
    currentValue () {
      const current = this.getFinalLabelFromItems(
        this.getFinalValue(this.value)
      )

      return this.getTranslation(current, 1, {}, current)
    },
    options () {
      return this.items.map((option) => {
        if (typeof option === 'string') {
          return {
            value: option,
            text: this.getTranslation(option, 1, {}, option)
          }
        }

        if (option.text) {
          option.text = this.getTranslation(option.text, 1, {}, option.text)
        }

        return option
      })
    }
  },
  methods: {
    getFinalValue (val) {
      return isObject(val) ? val.value : val
    },
    getFinalLabelFromItems (val) {
      const item = this.items.find((value) => {
        return value === val || value.value === val
      })
      if (!item) {
        return val
      }
      return item.text || item
    }
  }
}
