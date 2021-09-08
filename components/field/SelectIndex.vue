<template>
  <span>
    {{ currentValue }}
  </span>
</template>

<script>
import { isObject } from 'lodash'
import translator from '../../mixins/translator'
export default {
  name: 'SelectIndex',
  mixins: [translator],
  props: {
    value: {
      type: [String, Object],
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    currentValue() {
      const current = this.getFinalLabelFromItems(
        this.getFinalValue(this.value)
      )

      return this.getTranslation(current, 1, {}, current)
    },
  },
  methods: {
    getFinalValue(val) {
      return isObject(val) ? val.value : val
    },
    getFinalLabelFromItems(val) {
      const item = this.items.find((value) => {
        return value === val || value.value === val
      })
      if (!item) {
        return val
      }
      return item.text || item
    },
  },
}
</script>

<style scoped></style>
