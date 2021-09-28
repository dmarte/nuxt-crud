<template>
  <v-text-field
    type="number"
    :name="name"
    :min="min"
    :max="max"
    :loading="loading"
    :disabled="disabled"
    :value="value"
    :label="label"
    :dense="dense"
    :error-messages="response.feedback(name)"
    outlined
    @change="whenChange"
  />
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldNumberForm',
  mixins: [field],
  props: {
    placeholder: {
      type: String,
      required: true
    },
    min: {
      type: [Number, String],
      default: () => undefined
    },
    max: {
      type: [Number, String],
      default: () => undefined
    }
  }
}
</script>

<style scoped>

</style>
