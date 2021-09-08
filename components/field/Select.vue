<template>
  <v-select
    :value="value"
    :error-messages="response.feedback(name)"
    :items="options"
    :label="label"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="$listeners"
    @change="whenChange"
  />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldSelect',
  mixins: [fields],
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    options() {
      return this.items.map((option) => {
        if (typeof option === 'string') {
          return {
            value: option,
            text: this.$te(option) ? this.$tc(option, 1).toString() : option
          }
        }

        return option
      })
    },
  },
}
</script>

<style scoped></style>
