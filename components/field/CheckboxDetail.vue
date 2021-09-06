<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
      <slot>
        <v-icon>
          {{ value ? 'mdi-check' : 'mdi-block-helper' }}
        </v-icon>
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldCheckboxDetail',
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
