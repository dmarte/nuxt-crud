import { isObject } from 'lodash'
import translator from './translator'
import field from './field'

export default {
  mixins: [translator, field],
  props: {
    value: {
      type: [String, Object],
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentValue () {
      const current = this.getFinalLabelFromItems(
        this.getFinalValue(this.value)
      )

      return this.getTranslation(current, 1, {}, current)
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
