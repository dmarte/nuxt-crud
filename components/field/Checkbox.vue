<template>
  <v-checkbox
    :input-value="value"
    :error-messages="response.feedback(name)"
    :label="label"
    :disabled="disabled"
    :id="id"
    :true-value="trueValue"
    :false-value="falseValue"
    v-bind="$attrs"
    v-on="$listeners"
    @change="whenChange"
  />
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldCheckbox',
  mixins: [fields],
  props: {
    trueValue: {
      type: [Boolean, String],
      default: true,
    },
    falseValue: {
      type: [Boolean, String],
      default: false,
    },
  },
}
</script>

<style scoped></style>
