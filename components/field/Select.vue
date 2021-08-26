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
      return this.items.map(({ text, value }) => ({
        value,
        text: this.$te(text) ? this.$tc(text, 1) : text,
      }))
    },
  },
}
</script>

<style scoped></style>
