<template>
  <v-text-field
    :name="name"
    :loading="loading"
    :disabled="disabled"
    :value="value"
    :label="label"
    :hint="hint"
    :error-messages="response.feedback(name)"
    :dense="dense"
    outlined
    persistent-hint
    v-on="$listeners"
    @input="whenChange"
  />
</template>

<script>
import field from '../../mixins/resource/field'
export default {
  name: 'CFieldTextForm',
  mixins: [field],
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
