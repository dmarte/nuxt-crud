<template>
  <v-select
    :name="name"
    :loading="loading"
    :disabled="disabled"
    :value="value"
    :label="label"
    :error-messages="response.feedback(name)"
    :items="items"
    :dense="dense"
    outlined
    @change="whenChange"
  />
</template>

<script>
import field from '../../mixins/resource/field'
import select from '../../mixins/select'
export default {
  name: 'CFieldSelectForm',
  mixins: [field, select]
}
</script>

<style scoped>

</style>
