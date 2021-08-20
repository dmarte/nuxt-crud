<template>
  <v-textarea
    :value='value'
    :error-messages='response.feedback(name)'
    :label='label'
    :disabled='disabled'
    :placeholder='placeholder'
    :id='id'
    rows='1'
    auto-grow
    v-on='$listeners'
    v-bind='$attrs'
  />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldTextarea',
  mixins: [fields]
}
</script>

<style scoped>

</style>
