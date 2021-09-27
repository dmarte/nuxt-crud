<template>
  <v-textarea
    :value="value"
    :error-messages="response.feedback(name)"
    :label="label"
    :disabled="disabled"
    :placeholder="placeholder"
    :rows="1"
    :hint="hint"
    :loading="loading"
    outlined
    auto-grow
    @change="whenChange"
  />
</template>

<script>
import fields from '../../mixins/resource/field'
export default {
  name: 'CFieldTextareaForm',
  mixins: [fields],
  props: {
    placeholder: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
