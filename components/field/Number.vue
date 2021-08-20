<template>
  <c-field-text
    v-bind='$attrs'
    :id="id"
    :name="name"
    :placeholder="placeholder"
    :label="label"
    :value="value"
    :response="response"
    :disabled="disabled"
    :min="0"
    :max="0"
    type="number"
    v-on='$listeners'
    @change="whenChange"
  />
</template>

<script>
import field from '../../mixins/field'

export default {
  name: 'CFieldNumber',
  mixins: [field],
  props: {
    min: {
      type: Number,
      default: () => undefined,
    },
    max: {
      type: Number,
      default: () => undefined,
    },
  },
}
</script>
