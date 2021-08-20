<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
    <slot>
      {{ value }}
    </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import fields from '../../mixins/field'

export default {
  name: 'CFieldTextDetail',
  mixins: [fields],
  computed: {
    head() {
      return this.params?.head || {}
    },
  },
}
</script>

<style scoped></style>
