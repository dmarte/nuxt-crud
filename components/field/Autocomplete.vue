<template>
  <v-autocomplete
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
import field from '../../mixins/field'

export default {
  name: 'CFieldAutocomplete',
  mixins: [field],
  props: {
    options: {
      type: Array,
      default: () => []
    }
  }
}
</script>
