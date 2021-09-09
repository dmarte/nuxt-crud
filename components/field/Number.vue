<template>
  <v-text-field
    :name="name"
    :placeholder="placeholder"
    :label="label"
    :value="value"
    :response="response.feedback(name)"
    :disabled="disabled"
    :min="min"
    :max="max"
    type="number"
    v-on="$listeners"
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
      default: () => undefined
    },
    max: {
      type: Number,
      default: () => undefined
    }
  }
}
</script>
