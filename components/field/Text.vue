<template>
    <v-text-field
      :value="value"
      :error-messages="response.feedback(name)"
      :label="label"
      :id="id"
      :placeholder="placeholder"
      :disabled="disabled"
      :type="type"
      v-bind="$attrs"
      v-on="$listeners"
      @change="whenChange"
    />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldText',
  mixins: [fields],
  props: {
    type: {
      type: String,
      default: 'text',
    },
  },
}
</script>

<style scoped></style>
