<template>
  <v-text-field
    :label="label"
    :value="value"
    :disabled="disabled"
    :placeholder="placeholder"
    :error-messages="response.feedback(name)"
    :hint="hint"
    :dense="dense"
    type="number"
    clearable
    @change="whenChange"
  />
</template>

<script>
import field from '../../mixins/field'
export default {
  name: 'CFieldPhone',
  mixins: [field]
}
</script>

<style scoped></style>
