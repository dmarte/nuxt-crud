<template>
  <v-select
    :value='value'
    :error-messages='response.feedback(name)'
    :items='options'
    :label='label'
    :disabled='disabled'
    v-bind='$attrs'
    v-on='$listeners'
    @change='whenChange'
  />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldSelect',
  mixins: [fields],
  props: {
    options: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>

</style>
