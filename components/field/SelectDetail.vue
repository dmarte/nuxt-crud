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
import field from '../../mixins/field'
export default {
  name: 'CFieldSelectDetail',
  mixins: [field]
}
</script>

<style scoped>

</style>
