<template>
  <div>
    <v-autocomplete
      :error-messages="response.feedback(name)"
      :disabled="disabled"
      :hint="hint"
      :items="items.length > 0 ? items : options"
      :label="label"
      :loading="searching || loading"
      :placeholder="placeholder"
      :value="value"
      :dense="dense"
      cache-items
      hide-no-data
      hide-selected
      open-on-clear
      outlined
      @update:search-input="onSearch"
      @change="whenChange"
    />
    {{ value }}
  </div>
</template>

<script>
import field from '../../mixins/resource/field'
import remote from '../../mixins/resource/remote'
export default {
  name: 'CFieldSelectRemoteForm',
  mixins: [field, remote]
}
</script>

<style scoped></style>
