<template>
  <v-list-item :key="`item_${value}`">
    <v-list-item-subtitle>
      {{ label }}
    </v-list-item-subtitle>
    <v-list-item-title>
      <slot>
        {{ currentValue }}
      </slot>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
import select from '../../mixins/select'
export default {
  name: 'CFieldSelectDetail',
  mixins: [select]
}
</script>

<style scoped>

</style>
