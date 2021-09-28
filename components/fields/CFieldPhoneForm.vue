<template>
  <v-text-field
    :name="name"
    :loading="loading"
    :disabled="disabled"
    :value="phoneSanitize(value)"
    :hint="hint"
    :label="label"
    :error-messages="response.feedback(name)"
    :dense="dense"
    persistent-hint
    outlined
    @input="v => whenChange(phoneSanitize(v))"
  />
</template>

<script>
import field from '../../mixins/resource/field'
import phones from '../../mixins/phones'
export default {
  name: 'CFieldPhoneForm',
  mixins: [field, phones]
}
</script>

<style scoped>

</style>
