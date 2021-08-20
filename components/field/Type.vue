<template>
  <c-field-autocomplete
    :options='options'
    :name='name'
    :label='label'
    :id='id'
    :value='value'
    :placeholder='placeholder'
    :disabled='disabled'
    :response='response'
    v-on='$listeners'
    v-bind='$attrs'
  />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldType',
  mixins: [fields],
  computed: {
    options() {
      return this.$store.getters['fields/TYPES'].map(value => ({
        value,
        text: this.$t(`field.${value}`)
      }))
    }
  }
}
</script>

<style scoped></style>
