<template>
  <c-field-select
    :options="countries"
    :name="name"
    :label="label"
    :id="id"
    :value="value"
    :placeholder="placeholder"
    :disabled="disabled"
    :response="response"
    v-on="$listeners"
    v-bind="$attrs"
  />
</template>

<script>
import field from '../../mixins/field'

export default {
  name: 'CFieldCountry',
  mixins: [field],
  computed: {
    codes() {
      return ['DO', 'US', 'CA', 'FR', 'ES']
    },
    countries() {
      return this.codes.map((code) => ({ value: code, text: code }))
    },
  },
}
</script>

<style scoped></style>
