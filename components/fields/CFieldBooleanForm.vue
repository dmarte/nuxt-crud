<template>
  <v-checkbox
    :dense='dense'
    :disabled='disabled'
    :error-messages='response.feedback(name)'
    :false-value='params.falseValue'
    :hint='hint'
    :label='label'
    :true-value='params.trueValue'
    :value='value'
    @change='whenChange'
  />
</template>

<script>
import field from '../../mixins/resource/field'

export default {
  name: 'CFieldBooleanForm',
  mixins: [field]
}
</script>

<style scoped>

</style>
